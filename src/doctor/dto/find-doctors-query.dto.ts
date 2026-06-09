import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Specialization } from '../enums/specialization.enum';
import { getAllowedSpecializationValues } from '../enums/specialization.labels';

export class FindDoctorsQueryDto {
  @ApiPropertyOptional({
    description: 'Search doctors by name (partial, case-insensitive)',
    example: 'rahul',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by specialization',
    enum: Specialization,
    example: Specialization.CARDIOLOGIST,
  })
  @IsOptional()
  @IsEnum(Specialization, {
    message: `Invalid specialization. Allowed values: ${getAllowedSpecializationValues()}`,
  })
  specialization?: Specialization;

  @ApiPropertyOptional({
    description: 'Page number (starts at 1)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be a valid integer' })
  @Min(1, { message: 'page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of results per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be a valid integer' })
  @Min(1, { message: 'limit must be at least 1' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description:
      'Filter by availability. true = doctors with availability data',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) {
      return true;
    }
    if (value === 'false' || value === false) {
      return false;
    }
    return value;
  })
  @IsBoolean({ message: 'availability must be true or false' })
  availability?: boolean;
}
