import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { DoctorService } from './doctor.service';
import { User } from '../auth/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([DoctorProfile, User])],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}