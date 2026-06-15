import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { DoctorProfile } from '../../doctor/entities/doctor-profile.entity';
import { PatientProfile } from '../../patient/entities/patient-profile.entity';
import { AppointmentStatus } from '../enums/appointment-status.enum';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => DoctorProfile,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'doctorProfileId',
  })
  doctorProfile!: DoctorProfile;

  @ManyToOne(
    () => PatientProfile,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'patientProfileId',
  })
  patientProfile!: PatientProfile;

  @Column({
    type: 'date',
  })
  date!: string;

  @Column({
    type: 'time',
  })
  startTime!: string;

  @Column({
    type: 'time',
  })
  endTime!: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status!: AppointmentStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}