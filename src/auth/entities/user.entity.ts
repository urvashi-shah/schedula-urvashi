import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { DoctorProfile } from '../../doctor/entities/doctor-profile.entity';
import { PatientProfile } from '../../patient/entities/patient-profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToOne(() => DoctorProfile, (doctorProfile) => doctorProfile.user)
  doctorProfile: DoctorProfile;

  @OneToOne(() => PatientProfile, (patientProfile) => patientProfile.user)
  patientProfile: PatientProfile;
}