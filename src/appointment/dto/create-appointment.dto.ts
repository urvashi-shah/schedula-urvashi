import {
  IsDateString,
  IsInt,
  IsString,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsInt()
  doctorId!: number;

  @IsDateString()
  date!: string;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;
}