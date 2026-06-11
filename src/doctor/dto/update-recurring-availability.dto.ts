import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateRecurringAvailabilityDto } from './create-recurring-availability.dto';

export class UpdateRecurringAvailabilityDto extends PartialType(
  CreateRecurringAvailabilityDto,
) {
  @ApiPropertyOptional({
    example: true,
    description: 'Whether this recurring availability window is active',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
