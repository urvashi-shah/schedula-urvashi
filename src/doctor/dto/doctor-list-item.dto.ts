import { ApiProperty } from '@nestjs/swagger';

export class DoctorListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Dr. Rahul Sharma' })
  fullName: string;

  @ApiProperty({ example: 'Cardiologist' })
  specialization: string;

  @ApiProperty({ example: 10 })
  experience: number;

  @ApiProperty({ example: 500 })
  consultationFee: number;

  @ApiProperty({ example: 'Mon-Fri 9AM-5PM' })
  availability: string;
}
