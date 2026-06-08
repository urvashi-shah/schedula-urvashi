import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
  } from 'typeorm';
  
  import { User } from '../../auth/entities/user.entity';
  
  @Entity()
  export class PatientProfile {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    fullName: string;
  
    @Column()
    age: number;
  
    @Column()
    gender: string;
  
    @Column()
    contactDetails: string;
  
    @Column({ nullable: true })
    healthInformation: string;
  
    @OneToOne(() => User, (user) => user.patientProfile)
    @JoinColumn()
    user: User;
  }