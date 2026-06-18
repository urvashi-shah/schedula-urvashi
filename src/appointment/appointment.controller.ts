import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

//import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentService } from '../appointment/appointment.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';


@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointment')
export class AppointmentController {
constructor(
    private readonly appointmentService: AppointmentService,
) {}

  @ApiOperation({
    summary: 'Book appointment',
  })
  @Roles('PATIENT')
  @UseGuards(
    JwtGuard,
    RolesGuard,
  )
  @Post()
  bookAppointment(
    @Body()
    createAppointmentDto: CreateAppointmentDto,

    @Req() 
    req,
  ) {
    return this.appointmentService.bookAppointment(
      createAppointmentDto,
      req.user,
    );
  }
  @ApiOperation({
  summary:
    'Get my appointments',
})
@Roles('PATIENT')
@UseGuards(
  JwtGuard,
  RolesGuard,
)
@Get('my')
getMyAppointments(
  @Req()
  req,
) {
  return this.appointmentService.getMyAppointments(
    req.user,
  );
}

@ApiOperation({
  summary: 'Cancel appointment',
})
@Roles('PATIENT')
@UseGuards(
  JwtGuard,
  RolesGuard,
)
@Patch(':id/cancel')
cancelAppointment(
  @Param(
    'id',
    ParseIntPipe,
  )
  id: number,

  @Req()
  req,
) {
  return this.appointmentService.cancelAppointment(
    id,
    req.user,
  );
}
}