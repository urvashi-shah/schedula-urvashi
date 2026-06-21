import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import {
    InjectRepository,
} from '@nestjs/typeorm';

import {
    Repository,
} from 'typeorm';

import { Notification } from './entities/notification.entity';
import { PatientProfile } from '../patient/entities/patient-profile.entity';

@Injectable()
export class NotificationService {

    constructor(

        @InjectRepository(Notification)
        private readonly notificationRepository:
            Repository<Notification>,


        @InjectRepository(PatientProfile)
        private readonly patientProfileRepository:
            Repository<PatientProfile>,

    ) { }


    async createNotification(

        patientId: number,

        title: string,

        message: string,

    ) {

        const patientProfile =
            await this.patientProfileRepository.findOne({

                where: {
                    id: patientId,
                },

            });


        if (!patientProfile) {

            throw new NotFoundException(

                'Patient profile not found',

            );

        }


        const notification =
            this.notificationRepository.create({

                patientProfile,

                title,

                message,

            });


        await this.notificationRepository.save(

            notification,

        );

    }


    async getNotifications(

        user: { userId: number },

    ) {

        const patientProfile =
            await this.patientProfileRepository.findOne({

                where: {

                    user: {

                        id: user.userId,

                    },

                },

            });


        if (!patientProfile) {

            throw new NotFoundException(

                'Patient profile not found',

            );

        }


        const notifications =
            await this.notificationRepository.find({

                where: {

                    patientProfile: {

                        id: patientProfile.id,

                    },

                },

                order: {

                    createdAt: 'DESC',

                },

            });


        return {

           count:
    notifications.filter(
        notification =>
            !notification.isRead,
    ).length,

            notifications,

        };

    }
    
async markAsRead(
    notificationId: number,
    user: { userId: number },
) {

    const patientProfile =
        await this.patientProfileRepository.findOne({

            where: {

                user: {

                    id: user.userId,

                },

            },

        });


    if (!patientProfile) {

        throw new NotFoundException(

            'Patient profile not found',

        );

    }


    const notification =
        await this.notificationRepository.findOne({

            where: {

                id: notificationId,

                patientProfile: {

                    id: patientProfile.id,

                },

            },

        });


    if (!notification) {

        throw new NotFoundException(

            'Notification not found',

        );

    }


    notification.isRead = true;


    await this.notificationRepository.save(

        notification,

    );


    return {

        message:

            'Notification marked as read',

    };

}

}