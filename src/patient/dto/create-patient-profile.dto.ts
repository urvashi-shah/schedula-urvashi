import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
  } from 'class-validator';
  
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreatePatientProfileDto {
    @ApiProperty({
      example: 'Urvashi Shah',
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;
  
    @ApiProperty({
      example: 23,
    })
    @IsNumber(
      {},
      {
        message: 'Age should be a number',
      },
    )
    age: number;
  
    @ApiProperty({
      example: 'Female',
    })
    @IsString()
    @IsNotEmpty()
    gender: string;
  
    @ApiProperty({
      example: '+91 9876543210',
    })
    @IsString()
    @IsNotEmpty()
    contactDetails: string;
  
    @ApiProperty({
      example: 'No known allergies',
      required: false,
    })
    @IsOptional()
    @IsString()
    healthInformation?: string;
  }