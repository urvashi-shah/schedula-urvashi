import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateCustomAvailabilityDto {
  @ApiProperty({
    example: '2026-06-15',
    description: 'Override date in YYYY-MM-DD format',
  })
  @IsDateString(
    {},
    { message: 'date must be a valid date in YYYY-MM-DD format' },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;

  @ApiProperty({
    example: '14:00',
    description: 'Start time in HH:mm or HH:mm:ss format',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'startTime must be a valid time in HH:mm or HH:mm:ss format',
  })
  startTime: string;

  @ApiProperty({
    example: '16:00',
    description: 'End time in HH:mm or HH:mm:ss format',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'endTime must be a valid time in HH:mm or HH:mm:ss format',
  })
  endTime: string;

  @ApiPropertyOptional({
    example: 'Extended evening clinic',
    description: 'Optional reason for the availability override',
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
