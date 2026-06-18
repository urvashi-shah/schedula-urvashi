import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorProfile } from './doctor-profile.entity';

@Entity()
export class CustomAvailability {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => DoctorProfile,
    (doctorProfile) => doctorProfile.customAvailabilities,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'doctorProfileId' })
  doctorProfile: DoctorProfile;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  reason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
