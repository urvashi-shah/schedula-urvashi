import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';

import { SchedulingType } from '../enums/scheduling-type.enum';

export class CreateCustomAvailabilityDto {
  @ApiProperty({
    example: '2026-06-15',
    description: 'Override date in YYYY-MM-DD format',
  })
  @IsDateString(
    {},
    {
      message:
        'date must be a valid date in YYYY-MM-DD format',
    },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message:
      'date must be in YYYY-MM-DD format',
  })
  date!: string;

  @ApiProperty({
    example: '14:00',
    description:
      'Start time in HH:mm or HH:mm:ss format',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    {
      message:
        'startTime must be a valid time in HH:mm or HH:mm:ss format',
    },
  )
  startTime!: string;

  @ApiProperty({
    example: '16:00',
    description:
      'End time in HH:mm or HH:mm:ss format',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
    {
      message:
        'endTime must be a valid time in HH:mm or HH:mm:ss format',
    },
  )
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

  @ApiPropertyOptional({
    example: 'Extended evening clinic',
    description:
      'Optional reason for the availability override',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}