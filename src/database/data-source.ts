import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from '../auth/entities/user.entity';
import { DoctorProfile } from '../doctor/entities/doctor-profile.entity';
import { RecurringAvailability } from '../doctor/entities/recurring-availability.entity';
import { CustomAvailability } from '../doctor/entities/custom-availability.entity';
import { PatientProfile } from '../patient/entities/patient-profile.entity';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL ?? `postgres://${process.env.DB_USERNAME ?? 'postgres'}:${process.env.DB_PASSWORD ?? 'postgres'}@${process.env.DB_HOST ?? 'localhost'}:${process.env.DB_PORT ?? '5432'}/${process.env.DB_DATABASE ?? 'schedula_urvashi_db'}`;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,

  synchronize: false,

  entities: [
    User,
    DoctorProfile,
    RecurringAvailability,
    CustomAvailability,
    PatientProfile,
  ],

  migrations: ['src/database/migrations/*.ts'],
});