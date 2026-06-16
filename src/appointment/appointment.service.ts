import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,   
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Appointment } from './entities/appointment.entity';
import { DoctorProfile } from '../doctor/entities/doctor-profile.entity';
import { PatientProfile } from '../patient/entities/patient-profile.entity';
//import { User } from '../auth/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { CustomAvailability } from '../doctor/entities/custom-availability.entity';
import { RecurringAvailability } from '../doctor/entities/recurring-availability.entity';
import { SchedulingType } from '../doctor/enums/scheduling-type.enum';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository:
      Repository<Appointment>,

    @InjectRepository(DoctorProfile)
    private readonly doctorProfileRepository:
      Repository<DoctorProfile>,

    @InjectRepository(PatientProfile)
    private readonly patientProfileRepository:
      Repository<PatientProfile>,

    @InjectRepository(CustomAvailability)
private readonly customAvailabilityRepository:
  Repository<CustomAvailability>,

@InjectRepository(RecurringAvailability)
private readonly recurringAvailabilityRepository:
  Repository<RecurringAvailability>,
      // @InjectRepository(User)
    // private readonly userRepository:
    //   Repository<User>,
  ) {}

  async getPatientProfile(
    userId: number,
  ) {
    const patientProfile =
      await this.patientProfileRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });

    if (!patientProfile) {
      throw new NotFoundException(
        'Patient profile not found',
      );
    }

    return patientProfile;
  }
async bookAppointment(
  createAppointmentDto: CreateAppointmentDto,
  user: { userId: number },
) {
  const patientProfile =
    await this.getPatientProfile(
      user.userId,
    );

  const doctorProfile =
    await this.getDoctorProfile(
      createAppointmentDto.doctorId,
    );

  const availability =
    await this.resolveAvailabilityForBooking(
      doctorProfile.id,
      createAppointmentDto.date,
    );

  if (!availability) {
    throw new NotFoundException(
      'Doctor is not available on this date',
    );
  }

  const appointmentDateTime =
    new Date(
      `${createAppointmentDto.date}T${createAppointmentDto.startTime}`,
    );

  if (
    appointmentDateTime <=
    new Date()
  ) {
    throw new BadRequestException(
      'Appointment must be booked for a future date and time',
    );
  }

  let tokenNumber: number | null = null;

  if (
    availability.schedulingType ===
    SchedulingType.WAVE
  ) {
    if (
      createAppointmentDto.startTime !==
        availability.startTime ||
      createAppointmentDto.endTime !==
        availability.endTime
    ) {
      throw new BadRequestException(
        'Invalid wave time window',
      );
    }

    const existingPatientBooking =
      await this.appointmentRepository.findOne({
        where: {
          doctorProfile: {
            id: doctorProfile.id,
          },
          patientProfile: {
            id: patientProfile.id,
          },
          date: createAppointmentDto.date,
          status:
            AppointmentStatus.BOOKED,
        },
      });

    if (existingPatientBooking) {
      throw new ConflictException(
        'You have already booked this wave',
      );
    }

    const bookedAppointments =
      await this.appointmentRepository.find({
        where: {
          doctorProfile: {
            id: doctorProfile.id,
          },
          date: createAppointmentDto.date,
          startTime:
            availability.startTime,
          endTime:
            availability.endTime,
          status:
            AppointmentStatus.BOOKED,
        },
      });

    if (
      bookedAppointments.length >=
      (availability.capacity ?? 0)
    ) {
      throw new ConflictException(
        'Wave is full',
      );
    }

    tokenNumber =
      bookedAppointments.length + 1;
  }

  const existingAppointment =
    await this.appointmentRepository.findOne({
      where: {
        doctorProfile: {
          id: doctorProfile.id,
        },
        date: createAppointmentDto.date,
        startTime:
          createAppointmentDto.startTime,
        status:
          AppointmentStatus.BOOKED,
      },
    });

  if (
    availability.schedulingType ===
      SchedulingType.STREAM &&
    existingAppointment
  ) {
    throw new ConflictException(
      'Slot already booked',
    );
  }

  const appointment =
    this.appointmentRepository.create({
      doctorProfile,
      patientProfile,
      date: createAppointmentDto.date,
      startTime:
        createAppointmentDto.startTime,
      endTime:
        createAppointmentDto.endTime,
      status:
        AppointmentStatus.BOOKED,
      tokenNumber:
        tokenNumber ?? undefined,
    });

  const savedAppointment =
    await this.appointmentRepository.save(
      appointment,
    );

  return {
    message:
      'Appointment booked successfully',
    appointment: {
      id: savedAppointment.id,

      doctorId:
        doctorProfile.id,

      doctorName:
        doctorProfile.fullName,

      specialization:
        doctorProfile.specialization,

      patientId:
        patientProfile.id,

      patientName:
        patientProfile.fullName,

      date:
        savedAppointment.date,

      startTime:
        savedAppointment.startTime,

      endTime:
        savedAppointment.endTime,

      status:
        savedAppointment.status,

      tokenNumber:
        savedAppointment.tokenNumber,
    },
  };
}
  async getDoctorProfile(
    doctorId: number,
  ) {
    const doctorProfile =
      await this.doctorProfileRepository.findOne({
        where: {
          id: doctorId,
        },
      });

    if (!doctorProfile) {
      throw new NotFoundException(
        'Doctor not found',
      );
    }

    return doctorProfile;
  }

  private async resolveAvailabilityForBooking(
  doctorId: number,
  date: string,
) {
  const customAvailability =
    await this.customAvailabilityRepository.findOne({
      where: {
        doctorProfile: {
          id: doctorId,
        },
        date,
      },
      order: {
        startTime: 'ASC',
      },
    });

  if (customAvailability) {
    return customAvailability;
  }

  const dayOfWeek = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ][new Date(date).getDay()];

  return this.recurringAvailabilityRepository.findOne({
    where: {
      doctorProfile: {
        id: doctorId,
      },
      dayOfWeek: dayOfWeek as any,
      isActive: true,
    },
    order: {
      startTime: 'ASC',
    },
  });
}

  async getMyAppointments(
  user: { userId: number },
) {
  const patientProfile =
    await this.getPatientProfile(
      user.userId,
    );

  const appointments =
    await this.appointmentRepository.find({
      where: {
        patientProfile: {
          id: patientProfile.id,
        },
      },
      relations: [
        'doctorProfile',
      ],
      order: {
        date: 'DESC',
      },
    });
    if (appointments.length === 0) {
  return {
    message:
      'No appointments found',
    appointments: [],
  };
}

  return {
    appointments:
      appointments.map(
        (appointment) => ({
          id: appointment.id,

          doctorId:
            appointment.doctorProfile.id,

          doctorName:
            appointment.doctorProfile.fullName,

          specialization:
            appointment.doctorProfile.specialization,

          date:
            appointment.date,

          startTime:
  appointment.startTime
    .toString()
    .slice(0, 5),

endTime:
  appointment.endTime
    .toString()
    .slice(0, 5),

          status:
            appointment.status,
        }),
      ),
  };
}
async getDoctorAppointments(
  user: { userId: number },
) {
  const doctorProfile =
    await this.doctorProfileRepository.findOne({
      where: {
        user: {
          id: user.userId,
        },
      },
    });

  if (!doctorProfile) {
    throw new NotFoundException(
      'Doctor profile not found',
    );
  }

  const appointments =
    await this.appointmentRepository.find({
      where: {
        doctorProfile: {
          id: doctorProfile.id,
        },
      },
      relations: [
        'patientProfile',
      ],
      order: {
        date: 'DESC',
      },
    });

  return {
    appointments:
      appointments.map(
        (appointment) => ({
          id: appointment.id,

          patientId:
            appointment.patientProfile.id,

          patientName:
            appointment.patientProfile.fullName,

          date:
            appointment.date,

          startTime:
  appointment.startTime
    .toString()
    .slice(0, 5),

endTime:
  appointment.endTime
    .toString()
    .slice(0, 5),
          status:
            appointment.status,
        }),
      ),
  };
}
async cancelAppointment(
  appointmentId: number,
  user: { userId: number },
) {
  const patientProfile =
    await this.getPatientProfile(
      user.userId,
    );

  const appointment =
    await this.appointmentRepository.findOne({
      where: {
        id: appointmentId,
      },
      relations: [
        'patientProfile',
      ],
    });

  if (!appointment) {
    throw new NotFoundException(
      'Appointment not found',
    );
  }

  if (
    appointment.patientProfile.id !==
    patientProfile.id
  ) {
    throw new ForbiddenException(
      'You can only cancel your own appointments',
    );
  }

  if (
    appointment.status ===
    AppointmentStatus.CANCELLED
  ) {
    throw new ConflictException(
      'Appointment already cancelled',
    );
  }

  const appointmentDateTime =
    new Date(
      `${appointment.date}T${appointment.startTime}`,
    );

  if (
    appointmentDateTime <=
    new Date()
  ) {
    throw new BadRequestException(
      'Past appointments cannot be cancelled',
    );
  }

  appointment.status =
    AppointmentStatus.CANCELLED;

  await this.appointmentRepository.save(
    appointment,
  );

  return {
    message:
      'Appointment cancelled successfully',
  };
}
}