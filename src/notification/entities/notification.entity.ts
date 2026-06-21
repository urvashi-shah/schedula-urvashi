import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';

import { PatientProfile } from '../../patient/entities/patient-profile.entity';

@Entity()
export class Notification {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(
        () => PatientProfile,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'patientProfileId',
    })
    patientProfile!: PatientProfile;

    @Column()
    title!: string;

    @Column({
        type: 'text',
    })
    message!: string;


    @Column({
        default: false,
    })
    isRead!: boolean;


    @CreateDateColumn()
    createdAt!: Date;

}