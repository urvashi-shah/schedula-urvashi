import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientProfile } from './entities/patient-profile.entity';
import { PatientService } from './patient.service';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientProfile,
      User,
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}