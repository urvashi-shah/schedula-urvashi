import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorProfileController } from './doctor-profile.controller';
import { DoctorDiscoveryController } from './doctor-discovery.controller';
import { AvailabilityController } from './availability.controller';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { RecurringAvailability } from './entities/recurring-availability.entity';
import { CustomAvailability } from './entities/custom-availability.entity';
import { DoctorService } from './doctor.service';
import { User } from '../auth/entities/user.entity';
import { DoctorRecommendationService } from './services/doctor-recommendation.service';
import { OpenAiSpecialtyMatcherService } from './services/openai-specialty-matcher.service';
import { AvailabilityService } from './services/availability.service';
import { SlotService } from './services/slot.service';
import { SlotController } from './slot.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DoctorProfile,
      RecurringAvailability,
      CustomAvailability,
      User,
    ]),
  ],
  controllers: [
    DoctorProfileController,
    AvailabilityController,
    DoctorDiscoveryController,
    SlotController,
  ],
  providers: [
    DoctorService,
    DoctorRecommendationService,
    OpenAiSpecialtyMatcherService,
    AvailabilityService,
    SlotService,
  ],
})
export class DoctorModule {}
