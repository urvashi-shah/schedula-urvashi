import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorController } from './doctor.controller';
import { DoctorProfile } from './entities/doctor-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorProfile])],
  controllers: [DoctorController],
})
export class DoctorModule {}