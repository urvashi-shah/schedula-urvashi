import {
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProfile } from './entities/patient-profile.entity';
import { User } from '../auth/entities/user.entity';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';

@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(PatientProfile)
        private patientProfileRepository: Repository<PatientProfile>,
      
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

      async createProfile(
        createPatientProfileDto: CreatePatientProfileDto,
        user: any,
      ) {
        const existingProfile =
          await this.patientProfileRepository.findOne({
            where: {
              user: {
                id: user.userId,
              },
            },
          });
      
        if (existingProfile) {
          throw new ConflictException(
            'Patient profile already exists',
          );
        }
      
        const loggedInUser =
          await this.userRepository.findOne({
            where: {
              id: user.userId,
            },
          });
      
        if (!loggedInUser) {
          throw new ConflictException('User not found');
        }
      
        const patientProfile =
          this.patientProfileRepository.create({
            ...createPatientProfileDto,
            user: loggedInUser,
          });
      
        const savedProfile =
          await this.patientProfileRepository.save(
            patientProfile,
          );
      
        return {
          message:
            'Patient profile created successfully',
          profile: {
            id: savedProfile.id,
            fullName: savedProfile.fullName,
            age: savedProfile.age,
            gender: savedProfile.gender,
            contactDetails:
              savedProfile.contactDetails,
            healthInformation:
              savedProfile.healthInformation,
          },
        };
      }

      async getProfile(user: any) {
        const patientProfile =
          await this.patientProfileRepository.findOne({
            where: {
              user: {
                id: user.userId,
              },
            },
          });
      
        if (!patientProfile) {
          throw new NotFoundException(
            'Patient profile not found',
          );
        }
      
        return {
          profile: patientProfile,
        };
      }

      async updateProfile(
        updatePatientProfileDto: UpdatePatientProfileDto,
        user: any,
      ) {
        const patientProfile =
          await this.patientProfileRepository.findOne({
            where: {
              user: {
                id: user.userId,
              },
            },
          });
      
        if (!patientProfile) {
          throw new NotFoundException(
            'Patient profile not found',
          );
        }
      
        Object.assign(
          patientProfile,
          updatePatientProfileDto,
        );
      
        const updatedProfile =
          await this.patientProfileRepository.save(
            patientProfile,
          );
      
        return {
          message:
            'Patient profile updated successfully',
          profile: updatedProfile,
        };
      }
}