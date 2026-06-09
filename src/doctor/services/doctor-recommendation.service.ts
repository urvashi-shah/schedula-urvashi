import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorProfile } from '../entities/doctor-profile.entity';
import { OpenAiSpecialtyMatcherService } from './openai-specialty-matcher.service';
import { getSpecializationLabel } from '../enums/specialization.labels';
import { Specialization } from '../enums/specialization.enum';
import { OpenAiRecommendationResult } from '../interfaces/openai-recommendation.interface';

const TOP_DOCTOR_LIMIT = 3;
const FALLBACK_SUMMARY =
  'No exact specialist is currently available. You may consult a General Physician for an initial evaluation.';

@Injectable()
export class DoctorRecommendationService {
  private readonly logger = new Logger(
    DoctorRecommendationService.name,
  );

  constructor(
    @InjectRepository(DoctorProfile)
    private readonly doctorProfileRepository: Repository<DoctorProfile>,
    private readonly openAiSpecialtyMatcherService: OpenAiSpecialtyMatcherService,
  ) {}

  async recommend(symptoms: string) {
    this.logger.log(
      'Doctor recommendation request received',
    );
    this.logger.debug(
      `Symptoms length: ${symptoms.length}`,
    );

    try {
      const availableSpecialties =
        await this.getDistinctSpecializations();

      this.logger.debug(
        `Available doctor specializations: ${availableSpecialties.join(', ')}`,
      );

      if (availableSpecialties.length === 0) {
        this.logger.warn(
          'No specializations found in database',
        );
        throw new ServiceUnavailableException(
          'No doctor specializations are available for recommendation',
        );
      }

      const aiResult =
        await this.openAiSpecialtyMatcherService.matchSpecialties(
          symptoms,
          availableSpecialties,
        );

      this.logger.log(
        `OpenAI filtered_specialties: ${aiResult.filtered_specialties.join(', ') || 'none'}`,
      );
      this.logger.debug(
        `OpenAI matched_specialties: ${aiResult.matched_specialties.map((item) => item.specialty).join(', ') || 'none'}`,
      );

      const resolvedSpecialties =
        this.resolveSpecialtiesForMatching(
          aiResult,
          availableSpecialties,
        );

      this.logger.log('Matching doctors to AI specialties');
      this.logger.debug(
        `Final matching query specialties: ${resolvedSpecialties.join(', ') || 'none'}`,
      );

      const recommendedDoctors =
        await this.findTopDoctorsBySpecializations(
          resolvedSpecialties,
          TOP_DOCTOR_LIMIT,
        );

      if (recommendedDoctors.length > 0) {
        this.logger.log(
          `Returning ${recommendedDoctors.length} recommended doctors`,
        );

        return {
          summary: aiResult.summary,
          matched_specialties:
            aiResult.matched_specialties,
          recommendedDoctors,
          fallbackDoctors: [],
        };
      }

      this.logger.warn(
        'No doctors found for recommended specialties, applying fallback',
      );

      const fallbackDoctors =
        await this.findTopDoctorsBySpecialization(
          getSpecializationLabel(
            Specialization.GENERAL_PHYSICIAN,
          ),
          TOP_DOCTOR_LIMIT,
        );

      this.logger.log(
        `Fallback doctors found: ${fallbackDoctors.length}`,
      );

      return {
        summary:
          fallbackDoctors.length > 0
            ? FALLBACK_SUMMARY
            : aiResult.summary,
        matched_specialties:
          aiResult.matched_specialties,
        recommendedDoctors: [],
        fallbackDoctors,
      };
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof ServiceUnavailableException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }

      this.logger.warn(
        `Doctor recommendation failed: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Unable to process doctor recommendation',
      );
    }
  }

  private resolveSpecialtiesForMatching(
    aiResult: OpenAiRecommendationResult,
    availableSpecialties: string[],
  ): string[] {
    const candidateSpecialties = [
      ...aiResult.filtered_specialties,
      ...aiResult.matched_specialties.map(
        (item) => item.specialty,
      ),
    ]
      .map((specialty) => specialty?.trim())
      .filter((specialty) => specialty);

    const uniqueCandidates = [
      ...new Set(candidateSpecialties),
    ];

    const availableByNormalized = new Map(
      availableSpecialties.map((specialty) => [
        this.normalizeSpecialty(specialty),
        specialty,
      ]),
    );

    const resolved: string[] = [];

    for (const candidate of uniqueCandidates) {
      const canonical = availableByNormalized.get(
        this.normalizeSpecialty(candidate),
      );

      if (canonical) {
        resolved.push(canonical);
        continue;
      }

      const partialMatch = availableSpecialties.find(
        (available) =>
          this.normalizeSpecialty(
            available,
          ).includes(
            this.normalizeSpecialty(candidate),
          ) ||
          this.normalizeSpecialty(candidate).includes(
            this.normalizeSpecialty(available),
          ),
      );

      if (partialMatch) {
        this.logger.debug(
          `Partial specialty match: "${candidate}" -> "${partialMatch}"`,
        );
        resolved.push(partialMatch);
      } else {
        this.logger.warn(
          `AI specialty "${candidate}" not found in database specializations`,
        );
      }
    }

    return [...new Set(resolved)];
  }

  private normalizeSpecialty(
    value: string,
  ): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  private async getDistinctSpecializations(): Promise<
    string[]
  > {
    const rows =
      await this.doctorProfileRepository
        .createQueryBuilder('doctor')
        .select('doctor.specialization', 'specialization')
        .distinct(true)
        .where(
          "doctor.specialization IS NOT NULL AND TRIM(doctor.specialization) <> ''",
        )
        .orderBy('doctor.specialization', 'ASC')
        .getRawMany<{ specialization: string }>();

    return rows.map((row) => row.specialization);
  }

  private async findTopDoctorsBySpecializations(
    specializations: string[],
    limit: number,
  ) {
    if (specializations.length === 0) {
      this.logger.warn(
        'No resolved specialties for doctor query',
      );
      return [];
    }

    const normalizedSpecializations =
      specializations.map((specialization) =>
        this.normalizeSpecialty(specialization),
      );

    this.logger.debug(
      `Executing doctor query for specialties: ${normalizedSpecializations.join(', ')}`,
    );

    const doctors =
      await this.doctorProfileRepository
        .createQueryBuilder('doctor')
        .where(
          'LOWER(TRIM(doctor.specialization)) IN (:...specializations)',
          {
            specializations:
              normalizedSpecializations,
          },
        )
        .orderBy('doctor.experience', 'DESC')
        .addOrderBy('doctor.id', 'ASC')
        .take(limit)
        .getMany();

    this.logger.log(
      `Doctors found for recommended specialties: ${doctors.length}`,
    );

    return doctors.map((doctor) =>
      this.toListItem(doctor),
    );
  }

  private async findTopDoctorsBySpecialization(
    specialization: string,
    limit: number,
  ) {
    const doctors =
      await this.doctorProfileRepository
        .createQueryBuilder('doctor')
        .where(
          'LOWER(TRIM(doctor.specialization)) = :specialization',
          {
            specialization:
              this.normalizeSpecialty(
                specialization,
              ),
          },
        )
        .orderBy('doctor.experience', 'DESC')
        .addOrderBy('doctor.id', 'ASC')
        .take(limit)
        .getMany();

    return doctors.map((doctor) =>
      this.toListItem(doctor),
    );
  }

  private toListItem(doctor: DoctorProfile) {
    return {
      id: doctor.id,
      fullName: doctor.fullName,
      specialization: doctor.specialization,
      experience: doctor.experience,
      consultationFee: Number(
        doctor.consultationFee,
      ),
      availability: doctor.availability,
    };
  }
}
