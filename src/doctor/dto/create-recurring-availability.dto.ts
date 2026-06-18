import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { DayOfWeek } from '../enums/day-of-week.enum';

export class CreateRecurringAvailabilityDto {
  @ApiProperty({
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  @IsEnum(DayOfWeek, {
    message: 'dayOfWeek must be a valid day of the week',
  })
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    example: '10:00',
    description: 'Start time in HH:mm or HH:mm:ss format',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'startTime must be a valid time in HH:mm or HH:mm:ss format',
  })
  startTime: string;

  @ApiProperty({
    example: '13:00',
    description: 'End time in HH:mm or HH:mm:ss format',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'endTime must be a valid time in HH:mm or HH:mm:ss format',
  })
  endTime: string;
}
