import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Notification } from './entities/notification.entity';
import { PatientProfile } from '../patient/entities/patient-profile.entity';

import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Notification,
            PatientProfile,
        ]),
    ],

    providers: [
        NotificationService,
    ],

    controllers: [
        NotificationController,
    ],

    exports: [
        NotificationService,
    ],
})
export class NotificationModule {}