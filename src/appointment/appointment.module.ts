import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Appointment } from './entities/appointment.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

import { DoctorProfile } from '../doctor/entities/doctor-profile.entity';
import { PatientProfile } from '../patient/entities/patient-profile.entity';
import { CustomAvailability } from '../doctor/entities/custom-availability.entity';
import { RecurringAvailability } from '../doctor/entities/recurring-availability.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      DoctorProfile,
      PatientProfile,
      CustomAvailability,
      RecurringAvailability,
    ]),
  ],
  controllers: [
    AppointmentController,
  ],
  providers: [
    AppointmentService,
  ],
  exports: [
    AppointmentService,
  ],
})
export class AppointmentModule {}