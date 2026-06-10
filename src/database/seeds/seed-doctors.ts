import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source';
import { User } from '../../auth/entities/user.entity';
import { DoctorProfile } from '../../doctor/entities/doctor-profile.entity';
import {
  DOCTOR_SEED_COUNT,
  getDoctorSeedData,
  SEED_EMAIL_DOMAIN,
} from './doctor-seed.data';

const SEED_PASSWORD = 'SeedDoctor@123';

async function seedDoctors(): Promise<void> {
  console.log('Starting doctor seed...');
  console.log(
    `Target: ${DOCTOR_SEED_COUNT} doctors across all specializations`,
  );

  await AppDataSource.initialize();

  const userRepository =
    AppDataSource.getRepository(User);
  const doctorRepository =
    AppDataSource.getRepository(DoctorProfile);

  const seedDoctors = getDoctorSeedData();
  let inserted = 0;
  let skipped = 0;

  for (const doctorData of seedDoctors) {
    const existingUser =
      await userRepository.findOne({
        where: { email: doctorData.seedEmail },
      });

    if (existingUser) {
      console.log(
        `Skipping existing seed doctor: ${doctorData.seedEmail}`,
      );
      skipped++;
      continue;
    }

    const hashedPassword = await bcrypt.hash(
      SEED_PASSWORD,
      10,
    );

    const user = userRepository.create({
      name: doctorData.fullName,
      email: doctorData.seedEmail,
      password: hashedPassword,
      role: 'DOCTOR',
    });

    const savedUser =
      await userRepository.save(user);

    const doctorProfile = doctorRepository.create({
      fullName: doctorData.fullName,
      specialization: doctorData.specialization,
      experience: doctorData.experience,
      qualification: doctorData.qualification,
      consultationFee: doctorData.consultationFee,
      availability: doctorData.availability,
      profileDetails: doctorData.profileDetails,
      user: savedUser,
    });

    await doctorRepository.save(doctorProfile);

    console.log(
      `Inserted: ${doctorData.fullName} (${doctorData.specialization})`,
    );
    inserted++;
  }

  const totalSeedDoctors = await userRepository
    .createQueryBuilder('user')
    .where('user.email LIKE :pattern', {
      pattern: `%@${SEED_EMAIL_DOMAIN}`,
    })
    .getCount();

  console.log('---');
  console.log(`Inserted this run: ${inserted}`);
  console.log(`Skipped (already exist): ${skipped}`);
  console.log(
    `Total seed doctors in database: ${totalSeedDoctors}`,
  );
  console.log('Doctor seed completed.');

  await AppDataSource.destroy();
}

seedDoctors().catch((error) => {
  console.error('Doctor seed failed:', error);
  process.exit(1);
});
