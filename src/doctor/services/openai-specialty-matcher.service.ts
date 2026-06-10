import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { OpenAiRecommendationResult } from '../interfaces/openai-recommendation.interface';

const SYSTEM_PROMPT = `You are a medical specialty routing assistant, not a doctor.

Your job is to map the user's symptoms to the most relevant doctor specialties from the provided specialty list.

Rules:

1. Use only specialties present in the provided list.
2. Do not invent specialties.
3. Return the 1-2 most relevant specialties.
4. Keep explanation short and user-friendly.
5. If multiple specialties match, return the most relevant ones.
6. If no specialty matches well, return an empty filtered list.
7. Do not diagnose.
8. Do not recommend medicines.
9. Do not recommend treatments.
10. Output must be valid JSON only.

Input:

* user_symptoms
* available_specialties

Output JSON schema:

{
"summary": "short explanation",

"matched_specialties": [
{
"specialty": "exact specialty name",
"reason": "short reason"
}
],

"filtered_specialties": [
"exact specialty name"
]
}`;

@Injectable()
export class OpenAiSpecialtyMatcherService {
  private readonly logger = new Logger(
    OpenAiSpecialtyMatcherService.name,
  );
  private readonly openAiClient: OpenAI | null;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const apiKey =
      this.configService.get<string>(
        'OPENAI_API_KEY',
      );

    if (!apiKey) {
      this.logger.warn(
        'OPENAI_API_KEY is not configured',
      );
      this.openAiClient = null;
    } else {
      this.openAiClient = new OpenAI({ apiKey });
    }
  }

  async matchSpecialties(
    symptoms: string,
    availableSpecialties: string[],
  ): Promise<OpenAiRecommendationResult> {
    if (!this.openAiClient) {
      this.logger.warn(
        'OpenAI request blocked: API key missing',
      );
      throw new ServiceUnavailableException(
        'Doctor recommendation service is not configured',
      );
    }

    this.logger.log('Sending OpenAI specialty matching request');
    this.logger.debug(
      `Available specialties count: ${availableSpecialties.length}`,
    );

    try {
      const completion =
        await this.openAiClient.chat.completions.create(
          {
            model:
              this.configService.get<string>(
                'OPENAI_MODEL',
              ) ?? 'gpt-4o-mini',
            temperature: 0.2,
            response_format: {
              type: 'json_object',
            },
            messages: [
              {
                role: 'system',
                content: SYSTEM_PROMPT,
              },
              {
                role: 'user',
                content: JSON.stringify({
                  user_symptoms: symptoms,
                  available_specialties:
                    availableSpecialties,
                }),
              },
            ],
          },
        );

      const content =
        completion.choices[0]?.message?.content;

      if (!content) {
        this.logger.warn(
          'OpenAI returned an empty response',
        );
        throw new BadGatewayException(
          'Received an invalid response from the recommendation service',
        );
      }

      this.logger.debug('OpenAI response received');
      this.logger.debug(
        `OpenAI response content: ${content}`,
      );

      return this.parseOpenAiResponse(content);
    } catch (error) {
      if (
        error instanceof BadGatewayException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }

      this.logger.warn(
        `OpenAI request failed: ${error.message}`,
      );
      throw new ServiceUnavailableException(
        'Unable to generate doctor recommendation at this time. Please try again later.',
      );
    }
  }

  private parseOpenAiResponse(
    content: string,
  ): OpenAiRecommendationResult {
    let parsed: unknown;

    try {
      parsed = JSON.parse(content);
    } catch {
      this.logger.warn(
        'Failed to parse OpenAI JSON response',
      );
      throw new BadGatewayException(
        'Received an invalid response from the recommendation service',
      );
    }

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof (parsed as OpenAiRecommendationResult)
        .summary !== 'string' ||
      !Array.isArray(
        (parsed as OpenAiRecommendationResult)
          .matched_specialties,
      ) ||
      !Array.isArray(
        (parsed as OpenAiRecommendationResult)
          .filtered_specialties,
      )
    ) {
      this.logger.warn(
        'OpenAI JSON response missing required fields',
      );
      throw new BadGatewayException(
        'Received an invalid response from the recommendation service',
      );
    }

    const result =
      parsed as OpenAiRecommendationResult;

    const parsedResult = {
      summary: result.summary,
      matched_specialties:
        result.matched_specialties.map(
          (item) => ({
            specialty: String(item.specialty ?? '').trim(),
            reason: String(item.reason ?? '').trim(),
          }),
        ),
      filtered_specialties:
        result.filtered_specialties
          .map((item) => String(item).trim())
          .filter((item) => item.length > 0),
    };

    this.logger.log(
      `OpenAI parsed filtered_specialties: ${parsedResult.filtered_specialties.join(', ') || 'none'}`,
    );
    this.logger.log(
      `OpenAI parsed matched_specialties: ${parsedResult.matched_specialties.map((item) => item.specialty).join(', ') || 'none'}`,
    );

    return parsedResult;
  }
}
