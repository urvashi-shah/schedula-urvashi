import {
    IsString,
    IsNotEmpty,
    IsNumber,
  } from 'class-validator';
  
  export class CreateDoctorProfileDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;
  
    @IsString()
    @IsNotEmpty()
    specialization: string;
    
    @IsNumber(
        {},
        {
          message: 'Experience should be a number',
        },
      )
      experience: number;
  
    @IsString()
    @IsNotEmpty()
    qualification: string;
  
    @IsNumber(
        {},
        {
          message: 'Consultation fee should be a number',
        },
      )
      consultationFee: number;
  
    @IsString()
    @IsNotEmpty()
    availability: string;
  
    @IsString()
    @IsNotEmpty()
    profileDetails: string;
  }