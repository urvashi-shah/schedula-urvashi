import { Test, TestingModule } from '@nestjs/testing';
import { DoctorProfileController } from './doctor-profile.controller';
import { DoctorDiscoveryController } from './doctor-discovery.controller';

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
    }).compile();

    controller = module.get<DoctorDiscoveryController>(
      DoctorDiscoveryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
