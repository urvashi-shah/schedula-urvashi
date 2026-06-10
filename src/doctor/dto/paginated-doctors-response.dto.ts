import { ApiProperty } from '@nestjs/swagger';
import { DoctorListItemDto } from './doctor-list-item.dto';

export class PaginatedDoctorsResponseDto {
  @ApiProperty({ type: [DoctorListItemDto] })
  data: DoctorListItemDto[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}
