import { ApiProperty } from '@nestjs/swagger';
import { DoctorListItemDto } from './doctor-list-item.dto';

export class MatchedSpecialtyDto {
  @ApiProperty({ example: 'Gastroenterologist' })
  specialty: string;

  @ApiProperty({
    example:
      'Digestive and stomach-related symptoms are commonly treated by Gastroenterologists.',
  })
  reason: string;
}

export class DoctorRecommendationResponseDto {
  @ApiProperty({
    example:
      'Digestive symptoms are commonly handled by Gastroenterologists.',
  })
  summary: string;

  @ApiProperty({ type: [MatchedSpecialtyDto] })
  matched_specialties: MatchedSpecialtyDto[];

  @ApiProperty({ type: [DoctorListItemDto] })
  recommendedDoctors: DoctorListItemDto[];

  @ApiProperty({ type: [DoctorListItemDto] })
  fallbackDoctors: DoctorListItemDto[];
}
