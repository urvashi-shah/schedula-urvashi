import {
  IsDateString,
  IsString,
} from 'class-validator';

export class RescheduleAppointmentDto {

  @IsDateString()
  date!: string;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;

}