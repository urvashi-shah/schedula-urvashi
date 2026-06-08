import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
  } from 'class-validator';
  
  export class CreatePatientProfileDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;
  
    @IsNumber(
        {},
        {
          message: 'Age should be a number',
        },
      )
      age: number;
  
    @IsString()
    @IsNotEmpty()
    gender: string;
  
    @IsString()
    @IsNotEmpty()
    contactDetails: string;
  
    @IsOptional()
    @IsString()
    healthInformation?: string;
  }