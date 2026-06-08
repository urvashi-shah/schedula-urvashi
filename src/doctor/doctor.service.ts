import {
    ConflictException,
    Injectable,
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
    constructor(
        @InjectRepository(DoctorProfile)
        private doctorProfileRepository: Repository<DoctorProfile>,
      
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

      async createProfile(
        createDoctorProfileDto: CreateDoctorProfileDto,
        user: any,
      ) {
        const existingProfile =
          await this.doctorProfileRepository.findOne({
            where: {
              user: {
                id: user.userId,
              },
            },
          });
      
        if (existingProfile) {
          throw new ConflictException(
            'Doctor profile already exists',
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
      
        const doctorProfile =
          this.doctorProfileRepository.create({
            ...createDoctorProfileDto,
            user: loggedInUser,
          });
      
          const savedProfile =
          await this.doctorProfileRepository.save(
            doctorProfile,
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
        const doctorProfile =
          await this.doctorProfileRepository.findOne({
            where: {
              user: {
                id: user.userId,
              },
            },
          });
      
        if (!doctorProfile) {
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
        const doctorProfile =
          await this.doctorProfileRepository.findOne({
            where: {
              user: {
                id: user.userId,
              },
            },
          });
      
        if (!doctorProfile) {
          throw new NotFoundException(
            'Doctor profile not found',
          );
        }
      
        Object.assign(
          doctorProfile,
          updateDoctorProfileDto,
        );
      
        const updatedProfile =
          await this.doctorProfileRepository.save(
            doctorProfile,
          );
      
        return {
          message: 'Doctor profile updated successfully',
          profile: updatedProfile,
        };
      }



}