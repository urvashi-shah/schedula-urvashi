import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { User } from '../auth/entities/user.entity';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';

@Injectable()
export class DoctorService {
    private readonly logger = new Logger(
        DoctorService.name,
    );
    constructor(
        @InjectRepository(DoctorProfile)
        private doctorProfileRepository: Repository<DoctorProfile>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createProfile(
        createDoctorProfileDto: CreateDoctorProfileDto,
        user: any,
    ) {
        this.logger.log(
            `Doctor profile creation started for user ${user.userId}`,
        );
        this.logger.debug(
            `Checking existing doctor profile for user ${user.userId}`,
        );

        const existingProfile =
            await this.doctorProfileRepository.findOne({
                where: {
                    user: {
                        id: user.userId,
                    },
                },
            });

        if (existingProfile) {
            this.logger.warn(
                `Duplicate doctor profile creation attempt by user ${user.userId}`,
            );

            throw new ConflictException(
                'Doctor profile already exists',
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

            throw new ConflictException(
                'User not found',
            );
        }

        const doctorProfile =
            this.doctorProfileRepository.create({
                ...createDoctorProfileDto,
                user: loggedInUser,
            });

        this.logger.debug(
            `Saving doctor profile to database`,
        );

        const savedProfile =
            await this.doctorProfileRepository.save(
                doctorProfile,
            );

        this.logger.log(
            `Doctor profile created successfully for user ${user.userId}`,
        );

        return {
            message: 'Doctor profile created successfully',
            profile: {
                id: savedProfile.id,
                fullName: savedProfile.fullName,
                specialization: savedProfile.specialization,
                experience: savedProfile.experience,
                qualification: savedProfile.qualification,
                consultationFee: savedProfile.consultationFee,
                availability: savedProfile.availability,
                profileDetails: savedProfile.profileDetails,
            },
        };
    }

    async getProfile(user: any) {
        this.logger.log(
            `Fetching doctor profile for user ${user.userId}`,
        );
        this.logger.debug(
            `Searching doctor profile in database`,
        );

        const doctorProfile =
            await this.doctorProfileRepository.findOne({
                where: {
                    user: {
                        id: user.userId,
                    },
                },
            });

        if (!doctorProfile) {
            this.logger.warn(
                `Doctor profile not found for user ${user.userId}`,
            );
            throw new NotFoundException(
                'Doctor profile not found',
            );
        }

        return {
            profile: doctorProfile,
        };
    }

    async updateProfile(

        updateDoctorProfileDto: UpdateDoctorProfileDto,
        user: any,
    ) {
        this.logger.log(
            `Updating doctor profile for user ${user.userId}`,
        );

        this.logger.debug(
            `Searching existing doctor profile`,
        );

        const doctorProfile =
            await this.doctorProfileRepository.findOne({
                where: {
                    user: {
                        id: user.userId,
                    },
                },
            });

        if (!doctorProfile) {
            this.logger.warn(
                `Doctor profile not found for user ${user.userId}`,
            );

            throw new NotFoundException(
                'Doctor profile not found',
            );
        }

        Object.assign(
            doctorProfile,
            updateDoctorProfileDto,
        );

        this.logger.debug(
            `Applying profile updates`,
        );

        const updatedProfile =
            await this.doctorProfileRepository.save(
                doctorProfile,
            );
        this.logger.log(
            `Doctor profile updated successfully for user ${user.userId}`,
        );

        return {
            message: 'Doctor profile updated successfully',
            profile: updatedProfile,
        };
    }



}