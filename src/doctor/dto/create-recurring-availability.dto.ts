import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

import { DayOfWeek } from '../enums/day-of-week.enum';
import { SchedulingType } from '../enums/scheduling-type.enum';

export class CreateRecurringAvailabilityDto {
  @ApiProperty({
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  @IsEnum(DayOfWeek, {
    message: 'dayOfWeek must be a valid day of the week',
  })
  dayOfWeek!: DayOfWeek;

  @ApiProperty({
    example: '10:00',
    description: 'Start time in HH:mm or HH:mm:ss format',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message:
      'startTime must be a valid time in HH:mm or HH:mm:ss format',
  })
  startTime!: string;

  @ApiProperty({
    example: '13:00',
    description: 'End time in HH:mm or HH:mm:ss format',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message:
      'endTime must be a valid time in HH:mm or HH:mm:ss format',
  })
  endTime!: string;

  @ApiProperty({
    enum: SchedulingType,
    example: SchedulingType.STREAM,
    description:
      'STREAM = exact appointment slots, WAVE = token-based scheduling',
  })
  @IsEnum(SchedulingType)
  schedulingType!: SchedulingType;

  @ApiPropertyOptional({
    example: 5,
    description:
      'Buffer time in minutes between appointments. Applicable only for STREAM scheduling.',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  bufferTime?: number;

  @ApiPropertyOptional({
    example: 10,
    description:
      'Maximum patient capacity for the wave. Applicable only for WAVE scheduling.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}