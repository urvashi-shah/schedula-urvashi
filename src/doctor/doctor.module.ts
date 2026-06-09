import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorProfileController } from './doctor-profile.controller';
import { DoctorDiscoveryController } from './doctor-discovery.controller';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { DoctorService } from './doctor.service';
import { User } from '../auth/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([DoctorProfile, User])],
  controllers: [
    DoctorProfileController,
    DoctorDiscoveryController,
  ],
  providers: [DoctorService],
})
export class DoctorModule {}