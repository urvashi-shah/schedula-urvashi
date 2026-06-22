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
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';

//import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentService } from '../appointment/appointment.service';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';


@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) { }

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

@ApiOperation({
summary:
'Cancel all appointments for a date',
})

@ApiQuery({

name:'date',

example:'2026-06-22',

description:
'Date in YYYY-MM-DD format',

})

@UseGuards(
JwtGuard,
RolesGuard,
)

@Patch(
'cancel-day',
)

cancelAppointmentsForDay(

@Query('date')
date:string,

@Req()
req,

){

return this.appointmentService.cancelAppointmentsForDay(

date,

req.user,

);

}
@ApiOperation({
  summary:
    'Cancel appointments within a time range',
})

@ApiQuery({
  name: 'date',
  example: '2026-06-22',
  description:
    'Date in YYYY-MM-DD format',
})

@ApiQuery({
  name: 'startTime',
  example: '10:00',
  description:
    'Range start time',
})

@ApiQuery({
  name: 'endTime',
  example: '12:00',
  description:
    'Range end time',
})

@UseGuards(
  JwtGuard,
  RolesGuard,
)

@Patch(
  'cancel-range',
)

cancelAppointmentsForRange(

  @Query('date')
  date: string,

  @Query('startTime')
  startTime: string,

  @Query('endTime')
  endTime: string,

  @Req()
  req,

) {

  return this.appointmentService.cancelAppointmentsForRange(

    date,

    startTime,

    endTime,

    req.user,

  );

}

  @ApiOperation({
    summary:
      'Reschedule appointment',
  })
  @Roles('PATIENT')
  @UseGuards(
    JwtGuard,
    RolesGuard,
  )
  @Patch(':id/reschedule')
  rescheduleAppointment(

    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,

    @Body()
    dto: RescheduleAppointmentDto,

    @Req()
    req,

  ) {
    return this.appointmentService
      .rescheduleAppointment(

        id,

        dto,

        req.user,

      );
  }
}