import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { DoctorProfile } from './doctor-profile.entity';
import { SchedulingType } from '../enums/scheduling-type.enum';

@Entity()
export class RecurringAvailability {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => DoctorProfile,
    (doctorProfile) => doctorProfile.recurringAvailabilities,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'doctorProfileId' })
  doctorProfile!: DoctorProfile;

  @Column({
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek!: DayOfWeek;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({
  type: 'enum',
  enum: SchedulingType,
  default: SchedulingType.STREAM,
})
schedulingType!: SchedulingType;

@Column({
  type: 'int',
  nullable: true,
})
bufferTime?: number;

@Column({
  type: 'int',
  nullable: true,
})
capacity?: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
