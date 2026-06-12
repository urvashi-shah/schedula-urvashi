import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { DoctorProfile } from '../entities/doctor-profile.entity';
import { RecurringAvailability } from '../entities/recurring-availability.entity';
import { CustomAvailability } from '../entities/custom-availability.entity';
import { SlotStatus } from '../enums/slot-status.enum';

@Injectable()
export class SlotService {
  constructor(
    @InjectRepository(DoctorProfile)
    private readonly doctorProfileRepository: Repository<DoctorProfile>,

    @InjectRepository(RecurringAvailability)
    private readonly recurringAvailabilityRepository:
      Repository<RecurringAvailability>,

    @InjectRepository(CustomAvailability)
    private readonly customAvailabilityRepository:
      Repository<CustomAvailability>,
  ) {}

  async getDoctorProfile(
  doctorId: number,
) {
  const doctor =
    await this.doctorProfileRepository.findOne({
      where: {
        id: doctorId,
      },
    });

  if (!doctor) {
    throw new NotFoundException(
      'Doctor not found',
    );
  }

  return doctor;
}

private getDayOfWeek(
  date: string,
): string {
  const days = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];

  return days[new Date(date).getDay()];
}

async resolveAvailability(
  doctorId: number,
  date: string,
) {
  const doctor =
    await this.getDoctorProfile(
      doctorId,
    );

  const customAvailabilities =
    await this.customAvailabilityRepository.find({
      where: {
        doctorProfile: {
          id: doctor.id,
        },
        date,
      },
      order: {
        startTime: 'ASC',
      },
    });

  if (customAvailabilities.length > 0) {
    return {
      source: 'custom',
      doctor,
      availabilities: customAvailabilities,
    };
  }

  const dayOfWeek =
    this.getDayOfWeek(date);

  const recurringAvailabilities =
    await this.recurringAvailabilityRepository.find({
      where: {
        doctorProfile: {
          id: doctor.id,
        },
        dayOfWeek: dayOfWeek as any,
        isActive: true,
      },
      order: {
        startTime: 'ASC',
      },
    });

  return {
    source: 'recurring',
    doctor,
    availabilities:
      recurringAvailabilities,
  };
}

private generateSlots(
  startTime: string,
  endTime: string,
  slotDuration: number,
) {
  const slots: {
  startTime: string;
  endTime: string;
  status: string;
}[] = [];

  const start = new Date(
    `2000-01-01T${startTime}`,
  );

  const end = new Date(
    `2000-01-01T${endTime}`,
  );

  let current = new Date(start);

  while (
    current.getTime() +
      slotDuration * 60 * 1000 <=
    end.getTime()
  ) {
    const slotEnd = new Date(
      current.getTime() +
        slotDuration * 60 * 1000,
    );

    slots.push({
      startTime: current
        .toTimeString()
        .slice(0, 5),

      endTime: slotEnd
        .toTimeString()
        .slice(0, 5),

      status: SlotStatus.AVAILABLE,
    });

    current = slotEnd;
  }

  return slots;
}

async getSlots(
  doctorId: number,
  date: string,
) {

  if (isNaN(new Date(date).getTime())) {
  throw new BadRequestException(
    'Invalid date format. Use YYYY-MM-DD',
  );
}
const requestedDate = new Date(date);

const today = new Date();

today.setHours(
  0,
  0,
  0,
  0,
);

if (requestedDate < today) {
  throw new BadRequestException(
    'Past dates are not allowed',
  );
}

const resolvedAvailability =
  await this.resolveAvailability(
    doctorId,
    date,
  );

  const doctor =
  resolvedAvailability.doctor;

  const slotDuration =
  doctor.slotDuration;

  const allSlots: {
  startTime: string;
  endTime: string;
  status: string;
}[] = [];

  for (const availability of
  resolvedAvailability.availabilities) {

  const generatedSlots =
    this.generateSlots(
      availability.startTime,
      availability.endTime,
      slotDuration,
    );

  allSlots.push(
    ...generatedSlots,
  );
}
let filteredSlots: {
  startTime: string;
  endTime: string;
  status: string;
}[] = allSlots;

const currentDate = new Date()
  .toISOString()
  .split('T')[0];

if (date === currentDate) {
  const currentTime =
    new Date()
      .toTimeString()
      .slice(0, 5);

  filteredSlots =
    allSlots.filter(
      (slot) =>
        slot.startTime >= currentTime,
    );
}
if (filteredSlots.length === 0) {
  return {
    message:
      'No available slots found for this date',
    doctorId,
    date,
    slots: [],
  };
}
return {
  doctorId,
  date,
  slotDuration,
  source:
    resolvedAvailability.source,

  totalSlots:
    filteredSlots.length,

  availableSlots:
    filteredSlots.length,

  slots: filteredSlots,
};
}
}
