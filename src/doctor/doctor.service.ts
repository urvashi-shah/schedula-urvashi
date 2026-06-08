import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';

import { User } from '../auth/entities/user.entity';

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

}