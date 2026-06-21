import {
    Controller,
    Get,
    Patch,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {

    constructor(
        private readonly notificationService:
            NotificationService,
    ) {}

    @ApiOperation({
        summary:
            'Get notifications',
    })
    @Roles('PATIENT')
    @UseGuards(
        JwtGuard,
        RolesGuard,
    )
    @Get()
    getNotifications(
        @Req() req,
    ) {
        return this.notificationService.getNotifications(
            req.user,
        );
    }
    @ApiOperation({
    summary:
        'Mark notification as read',
})
@Roles('PATIENT')
@UseGuards(
    JwtGuard,
    RolesGuard,
)
@Patch(':id/read')
markAsRead(

    @Param('id')
    id: number,

    @Req()
    req,

) {

    return this.notificationService.markAsRead(

        Number(id),

        req.user,

    );

}

}