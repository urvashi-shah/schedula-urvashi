import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorProfileController } from './doctor-profile.controller';
import { DoctorDiscoveryController } from './doctor-discovery.controller';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { DoctorService } from './doctor.service';
import { User } from '../auth/entities/user.entity';
import { DoctorRecommendationService } from './services/doctor-recommendation.service';
import { OpenAiSpecialtyMatcherService } from './services/openai-specialty-matcher.service';


@Module({
  imports: [TypeOrmModule.forFeature([DoctorProfile, User])],
  controllers: [
    DoctorProfileController,
    DoctorDiscoveryController,
  ],
  providers: [
    DoctorService,
    DoctorRecommendationService,
    OpenAiSpecialtyMatcherService,
  ],
})
export class DoctorModule {}