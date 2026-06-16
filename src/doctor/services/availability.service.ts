import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorProfile } from '../entities/doctor-profile.entity';
import { RecurringAvailability } from '../entities/recurring-availability.entity';
import { CustomAvailability } from '../entities/custom-availability.entity';
import { CreateRecurringAvailabilityDto } from '../dto/create-recurring-availability.dto';
import { UpdateRecurringAvailabilityDto } from '../dto/update-recurring-availability.dto';
import { CreateCustomAvailabilityDto } from '../dto/create-custom-availability.dto';
import { DayOfWeek } from '../enums/day-of-week.enum';
import { SchedulingType } from '../enums/scheduling-type.enum';

@Injectable()
export class AvailabilityService {
  private readonly logger = new Logger(AvailabilityService.name);

  constructor(
    @InjectRepository(DoctorProfile)
    private readonly doctorProfileRepository: Repository<DoctorProfile>,
    @InjectRepository(RecurringAvailability)
    private readonly recurringAvailabilityRepository: Repository<RecurringAvailability>,
    @InjectRepository(CustomAvailability)
    private readonly customAvailabilityRepository: Repository<CustomAvailability>,
  ) {}

  async createAvailability(
    dto: CreateRecurringAvailabilityDto,
    user: { userId: number },
  ) {
    const doctorProfile = await this.getDoctorProfileForUser(user.userId);
    const startTime = this.normalizeTime(dto.startTime);
    const endTime = this.normalizeTime(dto.endTime);
    this.validateSchedulingConfiguration(
  dto.schedulingType,
  dto.bufferTime,
  dto.capacity,
);

    this.validateTimeRange(startTime, endTime);
    await this.validateNoDuplicateRecurring(
      doctorProfile.id,
      dto.dayOfWeek,
      startTime,
      endTime,
    );
    await this.validateNoOverlappingRecurring(
      doctorProfile.id,
      dto.dayOfWeek,
      startTime,
      endTime,
    );

   const availability =
  this.recurringAvailabilityRepository.create({
    doctorProfile,
    dayOfWeek: dto.dayOfWeek,
    startTime,
    endTime,
    schedulingType:
      dto.schedulingType,
    bufferTime:
      dto.bufferTime,
    capacity:
      dto.capacity,
  });

    const saved = await this.recurringAvailabilityRepository.save(availability);

    this.logger.log(
      `Recurring availability created for doctor ${doctorProfile.id}`,
    );

    return {
      message: 'Recurring availability created successfully',
      availability: this.toRecurringResponse(saved),
    };
  }

  async getAvailability(user: { userId: number }) {
    const doctorProfile = await this.getDoctorProfileForUser(user.userId);

    const availabilities = await this.recurringAvailabilityRepository.find({
      where: { doctorProfile: { id: doctorProfile.id } },
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });

    return {
      availabilities: availabilities.map((item) =>
        this.toRecurringResponse(item),
      ),
    };
  }

  async updateAvailability(
    id: number,
    dto: UpdateRecurringAvailabilityDto,
    user: { userId: number },
  ) {
    const doctorProfile = await this.getDoctorProfileForUser(user.userId);
    const availability = await this.findRecurringAvailabilityOrThrow(id);

    this.ensureOwnership(availability, doctorProfile.id);

    const dayOfWeek = dto.dayOfWeek ?? availability.dayOfWeek;
    const startTime = this.normalizeTime(
      dto.startTime ?? availability.startTime,
    );
    const endTime = this.normalizeTime(dto.endTime ?? availability.endTime);

    this.validateTimeRange(startTime, endTime);
    await this.validateNoDuplicateRecurring(
      doctorProfile.id,
      dayOfWeek,
      startTime,
      endTime,
      id,
    );
    await this.validateNoOverlappingRecurring(
      doctorProfile.id,
      dayOfWeek,
      startTime,
      endTime,
      id,
    );

    Object.assign(availability, {
      dayOfWeek,
      startTime,
      endTime,
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    });

    const updated =
      await this.recurringAvailabilityRepository.save(availability);

    this.logger.log(`Recurring availability ${id} updated`);

    return {
      message: 'Recurring availability updated successfully',
      availability: this.toRecurringResponse(updated),
    };
  }

  async deleteAvailability(id: number, user: { userId: number }) {
    const doctorProfile = await this.getDoctorProfileForUser(user.userId);
    const availability = await this.findRecurringAvailabilityOrThrow(id);

    this.ensureOwnership(availability, doctorProfile.id);

    await this.recurringAvailabilityRepository.remove(availability);

    this.logger.log(`Recurring availability ${id} deleted`);

    return {
      message: 'Recurring availability deleted successfully',
    };
  }

  async createOverride(
    dto: CreateCustomAvailabilityDto,
    user: { userId: number },
  ) {
    const doctorProfile = await this.getDoctorProfileForUser(user.userId);
    const date = this.normalizeDate(dto.date);
    const startTime = this.normalizeTime(dto.startTime);
    const endTime = this.normalizeTime(dto.endTime);
    this.validateSchedulingConfiguration(
  dto.schedulingType,
  dto.bufferTime,
  dto.capacity,
);

    this.validateTimeRange(startTime, endTime);
    await this.validateNoDuplicateCustom(
      doctorProfile.id,
      date,
      startTime,
      endTime,
    );
    await this.validateNoOverlappingCustom(
      doctorProfile.id,
      date,
      startTime,
      endTime,
    );

  const override =
  this.customAvailabilityRepository.create({
    doctorProfile,
    date,
    startTime,
    endTime,
    schedulingType:
      dto.schedulingType,
    bufferTime:
      dto.bufferTime,
    capacity:
      dto.capacity,
    reason:
      dto.reason,
  });

    const saved = await this.customAvailabilityRepository.save(override);

    this.logger.log(
      `Custom availability override created for doctor ${doctorProfile.id} on ${date}`,
    );

    return {
      message: 'Custom availability override created successfully',
      availability: this.toCustomResponse(saved),
    };
  }

  async getAvailabilityForDate(dateInput: string, user: { userId: number }) {
    const doctorProfile = await this.getDoctorProfileForUser(user.userId);
    const date = this.normalizeDate(dateInput);

    const customAvailabilities = await this.customAvailabilityRepository.find({
      where: {
        doctorProfile: { id: doctorProfile.id },
        date,
      },
      order: { startTime: 'ASC' },
    });

    if (customAvailabilities.length > 0) {
      return {
        date,
        source: 'custom' as const,
        availabilities: customAvailabilities.map((item) =>
          this.toCustomResponse(item),
        ),
      };
    }

    const dayOfWeek = this.getDayOfWeekFromDate(date);
    const recurringAvailabilities =
      await this.recurringAvailabilityRepository.find({
        where: {
          doctorProfile: { id: doctorProfile.id },
          dayOfWeek,
          isActive: true,
        },
        order: { startTime: 'ASC' },
      });

    return {
      date,
      dayOfWeek,
      source: 'recurring' as const,
      availabilities: recurringAvailabilities.map((item) =>
        this.toRecurringResponse(item),
      ),
    };
  }

  private async getDoctorProfileForUser(userId: number) {
    const doctorProfile = await this.doctorProfileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return doctorProfile;
  }

  private async findRecurringAvailabilityOrThrow(id: number) {
    const availability = await this.recurringAvailabilityRepository.findOne({
      where: { id },
      relations: { doctorProfile: true },
    });

    if (!availability) {
      throw new NotFoundException('Recurring availability not found');
    }

    return availability;
  }

  private ensureOwnership(
    availability: RecurringAvailability,
    doctorProfileId: number,
  ) {
    if (availability.doctorProfile.id !== doctorProfileId) {
      throw new ForbiddenException(
        'You do not have permission to manage this availability',
      );
    }
  }

  private validateTimeRange(startTime: string, endTime: string) {
    if (this.timeToMinutes(startTime) >= this.timeToMinutes(endTime)) {
      throw new BadRequestException(
        'Invalid time range: startTime must be before endTime',
      );
    }
  }

  private async validateNoDuplicateRecurring(
    doctorProfileId: number,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeId?: number,
  ) {
    const existing = await this.recurringAvailabilityRepository.find({
      where: {
        doctorProfile: { id: doctorProfileId },
        dayOfWeek,
        startTime,
        endTime,
      },
    });

    const duplicate = existing.find((item) => item.id !== excludeId);

    if (duplicate) {
      throw new BadRequestException(
        'Duplicate recurring availability: an identical window already exists for this day',
      );
    }
  }

  private async validateNoOverlappingRecurring(
    doctorProfileId: number,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeId?: number,
  ) {
    const existing = await this.recurringAvailabilityRepository.find({
      where: {
        doctorProfile: { id: doctorProfileId },
        dayOfWeek,
      },
    });

    const hasOverlap = existing
      .filter((item) => item.id !== excludeId)
      .some((item) =>
        this.timesOverlap(startTime, endTime, item.startTime, item.endTime),
      );

    if (hasOverlap) {
      throw new BadRequestException(
        'Overlapping recurring availability: this window conflicts with an existing window on the same day',
      );
    }
  }

  private async validateNoDuplicateCustom(
    doctorProfileId: number,
    date: string,
    startTime: string,
    endTime: string,
  ) {
    const existing = await this.customAvailabilityRepository.findOne({
      where: {
        doctorProfile: { id: doctorProfileId },
        date,
        startTime,
        endTime,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Duplicate custom availability: an identical override already exists for this date',
      );
    }
  }

  private async validateNoOverlappingCustom(
    doctorProfileId: number,
    date: string,
    startTime: string,
    endTime: string,
  ) {
    const existing = await this.customAvailabilityRepository.find({
      where: {
        doctorProfile: { id: doctorProfileId },
        date,
      },
    });

    const hasOverlap = existing.some((item) =>
      this.timesOverlap(startTime, endTime, item.startTime, item.endTime),
    );

    if (hasOverlap) {
      throw new BadRequestException(
        'Overlapping custom availability: this override conflicts with an existing window on the same date',
      );
    }
  }

  private timesOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string,
  ) {
    const aStart = this.timeToMinutes(startA);
    const aEnd = this.timeToMinutes(endA);
    const bStart = this.timeToMinutes(startB);
    const bEnd = this.timeToMinutes(endB);

    return aStart < bEnd && bStart < aEnd;
  }

  private timeToMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private normalizeTime(time: string) {
    const parts = time.split(':');

    if (parts.length === 2) {
      return `${parts[0]}:${parts[1]}:00`;
    }

    return time;
  }

  private normalizeDate(date: string) {
    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestException(
        'Invalid date: date must be a valid date in YYYY-MM-DD format',
      );
    }

    return date;
  }

  private getDayOfWeekFromDate(date: string): DayOfWeek {
    const [year, month, day] = date.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);
    const dayIndex = parsed.getDay();

    const dayMap: Record<number, DayOfWeek> = {
      0: DayOfWeek.SUNDAY,
      1: DayOfWeek.MONDAY,
      2: DayOfWeek.TUESDAY,
      3: DayOfWeek.WEDNESDAY,
      4: DayOfWeek.THURSDAY,
      5: DayOfWeek.FRIDAY,
      6: DayOfWeek.SATURDAY,
    };

    return dayMap[dayIndex];
  }

  private validateSchedulingConfiguration(
  schedulingType: SchedulingType,
  bufferTime?: number,
  capacity?: number,
) {
  if (
    schedulingType ===
    SchedulingType.STREAM
  ) {
    if (capacity !== undefined) {
      throw new BadRequestException(
        'Capacity is only applicable for WAVE scheduling',
      );
    }
  }

  if (
    schedulingType ===
    SchedulingType.WAVE
  ) {
    if (!capacity) {
      throw new BadRequestException(
        'Capacity is required for WAVE scheduling',
      );
    }

    if (bufferTime !== undefined) {
      throw new BadRequestException(
        'Buffer time is only applicable for STREAM scheduling',
      );
    }
  }
}

  private toRecurringResponse(availability: RecurringAvailability) {
    return {
      id: availability.id,
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime,
      isActive: availability.isActive,
      createdAt: availability.createdAt,
      updatedAt: availability.updatedAt,
      schedulingType:
  availability.schedulingType,

bufferTime:
  availability.bufferTime,

capacity:
  availability.capacity,
    };
  }

  private toCustomResponse(availability: CustomAvailability) {
    return {
      id: availability.id,
      date: availability.date,
      startTime: availability.startTime,
      endTime: availability.endTime,
      reason: availability.reason,
      createdAt: availability.createdAt,
      updatedAt: availability.updatedAt,
      schedulingType:
  availability.schedulingType,

bufferTime:
  availability.bufferTime,

capacity:
  availability.capacity,
    };
  }
  
}
