import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientProfile } from './entities/patient-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientProfile])],
  controllers: [PatientController],
})
export class PatientModule {}