import { ApiProperty } from '@nestjs/swagger';

import {
  IsDateString,
  IsInt,
  IsString,
  Matches,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    example: 51,
    description: 'Doctor profile id',
  })
  @IsInt()
  doctorId!: number;

  @ApiProperty({
    example: '2026-06-22',
    description: 'Appointment date in YYYY-MM-DD format',
  })
  @IsDateString()
  date!: string;

  @ApiProperty({
    example: '10:00:00',
    description:
      'Start time in HH:mm:ss format',
  })
  @IsString()
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    {
      message:
        'startTime must be a valid time in HH:mm or HH:mm:ss format',
    },
  )
  startTime!: string;

  @ApiProperty({
    example: '11:00:00',
    description:
      'End time in HH:mm:ss format',
  })
  @IsString()
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    {
      message:
        'endTime must be a valid time in HH:mm or HH:mm:ss format',
    },
  )
  endTime!: string;
}