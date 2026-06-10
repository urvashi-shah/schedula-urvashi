import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RecommendDoctorDto {
  @ApiProperty({
    description:
      'Patient symptoms described in plain language',
    example: 'I have stomach pain and bloating',
    minLength: 10,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'symptoms is required' })
  @MinLength(10, {
    message: 'symptoms must be at least 10 characters',
  })
  @MaxLength(500, {
    message: 'symptoms must not exceed 500 characters',
  })
  symptoms: string;
}
