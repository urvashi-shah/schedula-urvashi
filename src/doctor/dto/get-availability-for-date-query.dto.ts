import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, Matches } from 'class-validator';

export class GetAvailabilityForDateQueryDto {
  @ApiProperty({
    example: '2026-06-15',
    description: 'Date to resolve availability for, in YYYY-MM-DD format',
  })
  @IsDateString(
    {},
    { message: 'date must be a valid date in YYYY-MM-DD format' },
  )
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date: string;
}
