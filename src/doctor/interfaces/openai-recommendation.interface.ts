export interface MatchedSpecialty {
  specialty: string;
  reason: string;
}

export interface OpenAiRecommendationResult {
  summary: string;
  matched_specialties: MatchedSpecialty[];
  filtered_specialties: string[];
}
