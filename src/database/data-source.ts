import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { User } from '../auth/entities/user.entity';
import { DoctorProfile } from '../doctor/entities/doctor-profile.entity';
import { PatientProfile } from '../patient/entities/patient-profile.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'schedula_urvashi_db',

  synchronize: false,

  entities: [
    User,
    DoctorProfile,
    PatientProfile,
  ],

  migrations: ['src/database/migrations/*.ts'],
});