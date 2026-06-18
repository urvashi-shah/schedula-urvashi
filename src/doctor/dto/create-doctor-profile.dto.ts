import {
    IsString,
    IsNotEmpty,
    IsNumber,
  } from 'class-validator';
  
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateDoctorProfileDto {
    @ApiProperty({
      example: 'Dr. John Doe',
    })
    @IsString()
    @IsNotEmpty()
    fullName: string;
  
    @ApiProperty({
      example: 'Cardiologist',
    })
    @IsString()
    @IsNotEmpty()
    specialization: string;
  
    @ApiProperty({
      example: 10,
    })
    @IsNumber(
      {},
      {
        message: 'Experience should be a number',
      },
    )
    experience: number;
  
    @ApiProperty({
      example: 'MBBS, MD',
    })
    @IsString()
    @IsNotEmpty()
    qualification: string;
  
    @ApiProperty({
      example: 500,
    })
    @IsNumber(
      {},
      {
        message: 'Consultation fee should be a number',
      },
    )
    consultationFee: number;

    @ApiProperty({
  example: 15,
})
@IsNumber(
  {},
  {
    message: 'Slot duration should be a number',
  },
)
slotDuration: number;
  
    @ApiProperty({
      example: 'Mon-Fri 9AM-5PM',
    })
    @IsString()
    @IsNotEmpty()
    availability: string;
  
    @ApiProperty({
      example: 'Experienced heart specialist with 10 years of practice',
    })
    @IsString()
    @IsNotEmpty()
    profileDetails: string;
  }