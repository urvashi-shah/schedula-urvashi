import { Test, TestingModule } from '@nestjs/testing';
import { DoctorProfileController } from './doctor-profile.controller';
import { DoctorDiscoveryController } from './doctor-discovery.controller';
import { DoctorService } from './doctor.service';
import { DoctorRecommendationService } from './services/doctor-recommendation.service';

describe('DoctorProfileController', () => {
  let controller: DoctorProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorProfileController],
    }).compile();

    controller = module.get<DoctorProfileController>(
      DoctorProfileController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

describe('DoctorDiscoveryController', () => {
  let controller: DoctorDiscoveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorDiscoveryController],
      providers: [
        { provide: DoctorService, useValue: {} },
        {
          provide: DoctorRecommendationService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<DoctorDiscoveryController>(
      DoctorDiscoveryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
