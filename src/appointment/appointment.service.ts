import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository , Not} from 'typeorm';

import { Appointment } from './entities/appointment.entity';
import { DoctorProfile } from '../doctor/entities/doctor-profile.entity';
import { PatientProfile } from '../patient/entities/patient-profile.entity';
//import { User } from '../auth/entities/user.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { CustomAvailability } from '../doctor/entities/custom-availability.entity';
import { RecurringAvailability } from '../doctor/entities/recurring-availability.entity';
import { SchedulingType } from '../doctor/enums/scheduling-type.enum';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';

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
    ) { }

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

        await this.validatePatientOverlap(

            patientProfile.id,

            createAppointmentDto.date,

            createAppointmentDto.startTime,

            createAppointmentDto.endTime,

        );

        const availability =
            await this.resolveAvailabilityForBooking(

                doctorProfile.id,

                createAppointmentDto.date,

                createAppointmentDto.startTime,

                createAppointmentDto.endTime,

            );

       if (!availability) {

  const suggestedSlot =
    await this.findNextAvailableDateSlot(

      doctorProfile.id,

      createAppointmentDto.date,

    );

  throw new NotFoundException({

    message:
      'Doctor is not available on this date',

    suggestedSlot,

    note:
      suggestedSlot
        ? undefined
        : 'No suitable slot available. Please select another date.',

  });

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
                const durationInMinutes =

  (
    new Date(
      `1970-01-01T${availability.endTime}`,
    ).getTime()

    -

    new Date(
      `1970-01-01T${availability.startTime}`,
    ).getTime()

  )

  / 60000;



const suggestedSlot =

  await this.findNextAvailableSlot(

    doctorProfile.id,

    createAppointmentDto.date,

    availability.endTime,

    durationInMinutes,

  );



throw new ConflictException({

  message:
    'Wave is full',

  suggestedSlot,

  note:

    suggestedSlot

      ? undefined

      : 'No suitable slot available on this day. Please select another date.',

});
            }
            const maxToken =
                await this.getMaxTokenNumber(

                    doctorProfile.id,

                    createAppointmentDto.date,

                    availability.startTime,

                    availability.endTime,

                );

            tokenNumber =
                maxToken + 1;
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

  const durationInMinutes =

    (
      new Date(
        `1970-01-01T${createAppointmentDto.endTime}`,
      ).getTime()

      -

      new Date(
        `1970-01-01T${createAppointmentDto.startTime}`,
      ).getTime()

    )

    / 60000;



  const suggestedSlot =

    await this.findNextAvailableSlot(

      doctorProfile.id,

      createAppointmentDto.date,

      existingAppointment.endTime,

      durationInMinutes,

    );

throw new ConflictException({

    message:
      'Slot already booked',

    suggestedSlot,

    note:

      suggestedSlot

        ? undefined

        : 'No suitable slot available on this day. Please select another date.',

  });

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
        startTime?: string,
        endTime?: string,
    ) {

        const customAvailability =
            await this.customAvailabilityRepository.findOne({

                where: {

                    doctorProfile: {
                        id: doctorId,
                    },

                    date,

                    ...(startTime && {
                        startTime,
                    }),

                    ...(endTime && {
                        endTime,
                    }),

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

                dayOfWeek:
                    dayOfWeek as any,

                isActive: true,

                ...(startTime && {
                    startTime,
                }),

                ...(endTime && {
                    endTime,
                }),

            },

        });

    }

    private async getMaxTokenNumber(
        doctorId: number,
        date: string,
        startTime: string,
        endTime: string,
    ) {
        const appointments =
            await this.appointmentRepository.find({
                where: {
                    doctorProfile: {
                        id: doctorId,
                    },
                    date,
                    startTime,
                    endTime,
                    status:
                        AppointmentStatus.BOOKED,
                },
            });

        return Math.max(
            0,
            ...appointments.map(
                appointment =>
                    appointment.tokenNumber ??
                    0,
            ),
        );
    }

    private async validatePatientOverlap(

        patientId: number,

        date: string,

        startTime: string,

        endTime: string,

        excludeAppointmentId?: number,

    ) {

        const appointments =
            await this.appointmentRepository.find({

                where: {

                    patientProfile: {
                        id: patientId,
                    },

                    date,

                    status:
                        AppointmentStatus.BOOKED,

                },

                relations: [
                    'doctorProfile',
                ],

            });

        const overlappingAppointment =
            appointments.find(

                appointment => {

                    if (
                        appointment.id ===
                        excludeAppointmentId
                    ) {
                        return false;
                    }

                    return (

                        startTime <
                        appointment.endTime &&

                        endTime >
                        appointment.startTime

                    );

                },

            );



        if (
            overlappingAppointment
        ) {

            const durationInMinutes =

                (
                    new Date(
                        `1970-01-01T${endTime}`,
                    ).getTime()

                    -

                    new Date(
                        `1970-01-01T${startTime}`,
                    ).getTime()

                )

                /

                60000;



            const suggestedSlot =

                await this.findNextAvailableSlot(

                    overlappingAppointment
                        .doctorProfile.id,

                    date,

                    overlappingAppointment
                        .endTime,

                    durationInMinutes,

                );



            throw new ConflictException({

                message:
                    'Appointment overlaps with another booking',



                conflictingAppointment: {

                    id:
                        overlappingAppointment.id,

                    date:
                        overlappingAppointment.date,

                    startTime:
                        overlappingAppointment.startTime,

                    endTime:
                        overlappingAppointment.endTime,

                },



                suggestedSlot,



                note:

                    suggestedSlot

                        ? undefined

                        : 'No suitable slot available on this day. Please select another date.',

            });

        }

    }
    private async findNextAvailableSlot(

        doctorId: number,

        date: string,

        suggestedStartTime: string,

        durationInMinutes: number,

    ) {

        const availability =
            await this.resolveAvailabilityForBooking(

                doctorId,

                date,

            );



        if (!availability) {

            return null;

        }



        const suggestedStartDate =

            new Date(

                `1970-01-01T${suggestedStartTime}`,

            );



        const suggestedEndDate =

            new Date(

                suggestedStartDate,

            );



        suggestedEndDate.setMinutes(

            suggestedEndDate.getMinutes()

            + durationInMinutes,

        );



        const suggestedEndTime =

            suggestedEndDate

                .toTimeString()

                .slice(

                    0,

                    8,

                );



        if (

            suggestedStartTime >=

            availability.startTime &&



            suggestedEndTime <=

            availability.endTime

        ) {

            return {

                date,

                startTime:

                    suggestedStartTime,



                endTime:

                    suggestedEndTime,

            };

        }
        return null;

    }
    private async findNextAvailableDateSlot(

        doctorId: number,

        requestedDate: string,

    ) {

        const suggestions: {

            date: string;

            startTime: string;

            endTime: string;

        }[] = [];



        const customAvailabilities =

            await this.customAvailabilityRepository.find({

                where: {

                    doctorProfile: {

                        id: doctorId,

                    },

                },

                order: {

                    date: 'ASC',

                },

            });



        for (

            const availability

            of customAvailabilities

        ) {

            if (

                availability.date >

                requestedDate

            ) {

                suggestions.push({

                    date:

                        availability.date,



                    startTime:

                        availability.startTime,



                    endTime:

                        availability.endTime,

                });

            }

        }



        for (

            let i = 1;

            i <= 14;

            i++

        ) {

            const nextDate =

                new Date(

                    requestedDate,

                );



            nextDate.setDate(

                nextDate.getDate()

                + i,

            );



            const date =

                nextDate

                    .toISOString()

                    .slice(

                        0,

                        10,

                    );



            const dayOfWeek = [

                'SUNDAY',

                'MONDAY',

                'TUESDAY',

                'WEDNESDAY',

                'THURSDAY',

                'FRIDAY',

                'SATURDAY',

            ][

                nextDate.getDay()

            ];



            const recurringAvailability =

                await this.recurringAvailabilityRepository.findOne({

                    where: {

                        doctorProfile: {

                            id: doctorId,

                        },



                        dayOfWeek:

                            dayOfWeek as any,



                        isActive:

                            true,

                    },



                    order: {

                        startTime:

                            'ASC',

                    },

                });



            if (

                recurringAvailability

            ) {

                suggestions.push({

                    date,



                    startTime:

                        recurringAvailability.startTime,



                    endTime:

                        recurringAvailability.endTime,

                });

            }

        }



        suggestions.sort(

            (

                a,

                b,

            ) =>

                a.date.localeCompare(

                    b.date,

                ),

        );



        return (

            suggestions[0]

            ??

            null

        );

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
        date?: string,
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

                   status: Not(
    AppointmentStatus.CANCELLED,
),
                    ...(date && { date }),
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
                         
                        tokenNumber:
                           appointment.tokenNumber,    
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

        const now =
            new Date();

        const minutesLeft =
            (
                appointmentDateTime.getTime() -
                now.getTime()
            ) /
            (1000 * 60);

        
            if (
            appointmentDateTime <= now
        ) {
            throw new BadRequestException(
                'Past appointments cannot be cancelled',
            );
        }

        if (
            minutesLeft < 30
        ) {
            throw new BadRequestException(
                'Appointments cannot be cancelled within 30 minutes of scheduled time',
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
 async cancelDoctorAppointment(
    appointmentId: number,
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

    const appointment =
        await this.appointmentRepository.findOne({
            where: {
                id: appointmentId,
            },
            relations: [
                'doctorProfile',
            ],
        });

    if (!appointment) {
        throw new NotFoundException(
            'Appointment not found',
        );
    }

    if (
        appointment.doctorProfile.id !==
        doctorProfile.id
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
    async rescheduleAppointment(
        appointmentId: number,
        dto: RescheduleAppointmentDto,
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
                    'doctorProfile',
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
                'You can only reschedule your own appointments',
            );
        }

        if (
            appointment.status ===
            AppointmentStatus.CANCELLED
        ) {
            throw new ConflictException(
                'Cancelled appointments cannot be rescheduled',
            );
        }


        if (
            appointment.date ===
            dto.date &&
            appointment.startTime ===
            dto.startTime &&
            appointment.endTime ===
            dto.endTime
        ) {
            throw new ConflictException(
                'Appointment already scheduled for requested slot',
            );
        }

        const currentAppointmentDateTime =
            new Date(
                `${appointment.date}T${appointment.startTime}`,
            );

        const now =
            new Date();

        const minutesLeft =
            (
                currentAppointmentDateTime.getTime() -
                now.getTime()
            ) /
            (1000 * 60);

        if (
            minutesLeft < 30
        ) {
            throw new BadRequestException(
                'Appointments cannot be rescheduled within 30 minutes of scheduled time',
            );
        }

        const newAppointmentDateTime =
            new Date(
                `${dto.date}T${dto.startTime}`,
            );

        if (
            newAppointmentDateTime <=
            now
        ) {
            throw new BadRequestException(
                'Appointment must be rescheduled to a future date and time',
            );
        }
        await this.validatePatientOverlap(

            patientProfile.id,

            dto.date,

            dto.startTime,

            dto.endTime,

            appointment.id,

        );

        const availability =
            await this.resolveAvailabilityForBooking(

                appointment.doctorProfile.id,

                dto.date,

                dto.startTime,

                dto.endTime,

            );
        if (!availability) {

  const suggestedSlot =

    await this.findNextAvailableDateSlot(

      appointment.doctorProfile.id,

      dto.date,

    );



  throw new NotFoundException({

    message:
      'Doctor is not available on this date',

    suggestedSlot,

    note:

      suggestedSlot

        ? undefined

        : 'No suitable slot available. Please select another date.',

  });

}

        let tokenNumber:
            number | null =
            null;

        if (
            availability.schedulingType ===
            SchedulingType.WAVE
        ) {

            if (
                dto.startTime !==
                availability.startTime ||
                dto.endTime !==
                availability.endTime
            ) {
                throw new BadRequestException(
                    'Invalid wave time window',
                );
            }

            const bookedAppointments =
                await this.appointmentRepository.find({
                    where: {
                        doctorProfile: {
                            id:
                                appointment.doctorProfile.id,
                        },

                        date:
                            dto.date,

                        startTime:
                            availability.startTime,

                        endTime:
                            availability.endTime,

                        status:
                            AppointmentStatus.BOOKED,
                    },
                });

            const activeBookings =
                bookedAppointments.filter(
                    booking =>
                        booking.id !==
                        appointment.id,
                );

            if (
    activeBookings.length >=
    (availability.capacity ?? 0)
) {

    const durationInMinutes =

        (

            new Date(
                `1970-01-01T${availability.endTime}`,
            ).getTime()

            -

            new Date(
                `1970-01-01T${availability.startTime}`,
            ).getTime()

        )

        / 60000;



    const suggestedSlot =

        await this.findNextAvailableSlot(

            appointment.doctorProfile.id,

            dto.date,

            availability.endTime,

            durationInMinutes,

        );



    throw new ConflictException({

        message:
            'Wave is full',

        suggestedSlot,

        note:

            suggestedSlot

                ? undefined

                : 'No suitable slot available on this day. Please select another date.',

    });

}

            const maxToken =
                await this.getMaxTokenNumber(

                    appointment.doctorProfile.id,

                    dto.date,

                    availability.startTime,

                    availability.endTime,

                );

            tokenNumber =
                maxToken + 1;
        }

        const existingAppointment =
            await this.appointmentRepository.findOne({
                where: {

                    doctorProfile: {
                        id:
                            appointment.doctorProfile.id,
                    },

                    date:
                        dto.date,

                    startTime:
                        dto.startTime,

                    status:
                        AppointmentStatus.BOOKED,

                },
            });

if (

    availability.schedulingType ===
    SchedulingType.STREAM &&

    existingAppointment &&

    existingAppointment.id !==
    appointment.id

) {

    throw new ConflictException(

        'Slot already booked',

    );

}

        appointment.date =
            dto.date;

        appointment.startTime =
            dto.startTime;

        appointment.endTime =
            dto.endTime;

        appointment.tokenNumber =
            tokenNumber ??
            appointment.tokenNumber;

        const savedAppointment =
            await this.appointmentRepository.save(
                appointment,
            );

        return {

            message:
                'Appointment rescheduled successfully',

            appointment: {

                id:
                    savedAppointment.id,

                doctorId:
                    appointment.doctorProfile.id,

                doctorName:
                    appointment.doctorProfile.fullName,

                specialization:
                    appointment.doctorProfile.specialization,

                patientId:
                    appointment.patientProfile.id,

                patientName:
                    appointment.patientProfile.fullName,

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
}