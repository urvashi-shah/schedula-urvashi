import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
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
import { DoctorService } from './doctor.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { AppointmentService } from '../appointment/appointment.service';

@ApiTags('Doctor Profile')
@ApiBearerAuth()
@Controller('doctor')
export class DoctorProfileController {
    constructor(
        private readonly doctorService: DoctorService,
        private readonly appointmentService: AppointmentService,
    ) {}

    @ApiOperation({
        summary: 'Create doctor profile',
    })
    @Roles('DOCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Post('profile')
    createProfile(
        @Body() createDoctorProfileDto: CreateDoctorProfileDto,
        @Req() req,
    ) {
        return this.doctorService.createProfile(
            createDoctorProfileDto,
            req.user,
        );
    }

    @ApiOperation({
        summary: 'Get doctor profile',
    })
    @Roles('DOCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return this.doctorService.getProfile(
            req.user,
        );
    }

    @ApiOperation({
        summary: 'Update doctor profile',
    })
    @Roles('DOCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Patch('profile')
    updateProfile(
        @Body() updateDoctorProfileDto: UpdateDoctorProfileDto,
        @Req() req,
    ) {
        return this.doctorService.updateProfile(
            updateDoctorProfileDto,
            req.user,
        );
    }
    @ApiOperation({
    summary: 'Get doctor appointments',
})
@Roles('DOCTOR')
@UseGuards(
    JwtGuard,
    RolesGuard,
)
@Get('appointments')
getAppointments(
    @Req() req,
) {
    return this.appointmentService.getDoctorAppointments(
        req.user,
    );
}
}
