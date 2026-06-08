import {
    ConflictException,
    Injectable,
    Logger,
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
    private readonly logger = new Logger(
        PatientService.name,
    );

    constructor(
        @InjectRepository(PatientProfile)
        private patientProfileRepository: Repository<PatientProfile>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createProfile(
        createPatientProfileDto: CreatePatientProfileDto,
        user: any,
    ) {
        this.logger.log(
            `Patient profile creation started for user ${user.userId}`,
        );

        this.logger.debug(
            `Checking existing patient profile for user ${user.userId}`,
        );

        const existingProfile =
            await this.patientProfileRepository.findOne({
                where: {
                    user: {
                        id: user.userId,
                    },
                },
            });

        if (existingProfile) {
            this.logger.warn(
                `Duplicate patient profile creation attempt by user ${user.userId}`,
            );
            throw new ConflictException(
                'Patient profile already exists',
            );
        }

        this.logger.debug(
            `Fetching user details for user ${user.userId}`,
        );
        const loggedInUser =
            await this.userRepository.findOne({
                where: {
                    id: user.userId,
                },
            });

        if (!loggedInUser) {
            this.logger.warn(
                `User ${user.userId} not found`,
            );
            throw new ConflictException('User not found');
        }

        const patientProfile =
            this.patientProfileRepository.create({
                ...createPatientProfileDto,
                user: loggedInUser,
            });

        this.logger.debug(
            `Saving patient profile to database`,
        );

        const savedProfile =
            await this.patientProfileRepository.save(
                patientProfile,
            );

        this.logger.log(
            `Patient profile created successfully for user ${user.userId}`,
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
        this.logger.log(
            `Fetching patient profile for user ${user.userId}`,
        );

        this.logger.debug(
            `Searching patient profile in database`,
        );
        const patientProfile =
            await this.patientProfileRepository.findOne({
                where: {
                    user: {
                        id: user.userId,
                    },
                },
            });

        if (!patientProfile) {
            this.logger.warn(
                `Patient profile not found for user ${user.userId}`,
            );
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
        this.logger.log(
            `Updating patient profile for user ${user.userId}`,
        );

        this.logger.debug(
            `Searching existing patient profile`,
        );
        const patientProfile =
            await this.patientProfileRepository.findOne({
                where: {
                    user: {
                        id: user.userId,
                    },
                },
            });

        if (!patientProfile) {
            this.logger.warn(
                `Patient profile not found for user ${user.userId}`,
            );
            throw new NotFoundException(
                'Patient profile not found',
            );
        }

        Object.assign(
            patientProfile,
            updatePatientProfileDto,
        );

        this.logger.debug(
            `Applying profile updates`,
        );
        const updatedProfile =
            await this.patientProfileRepository.save(
                patientProfile,
            );
        this.logger.log(
            `Patient profile updated successfully for user ${user.userId}`,
        );


        return {
            message:
                'Patient profile updated successfully',
            profile: updatedProfile,
        };
    }
}