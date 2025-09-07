import { httpClient } from 'utils/http.client';
import path from 'path';
import * as fs from 'node:fs/promises';
import { GoogleAdapter } from './google.adapter';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { GoogleReview } from '../types/types';

@Injectable()
export class GoogleFetcher {
  constructor(
    private readonly adapter: GoogleAdapter,
    private readonly configService: ConfigService,
  ) {}

  async fetchMockReviews(mockReviewPath?: string) {
    const reviewPath =
      mockReviewPath ??
      path.join(
        process.cwd(),
        '../../../scripts/data/mock-google-reviews.json',
      );
    const raw = await fs.readFile(reviewPath, 'utf-8');
    const json = JSON.parse(raw);
    return json.result;
  }

  async findPlaceIdByTextSearch(
    query: string,
    latitude: number,
    longitude: number,
  ) {
    const URL = this.configService.get<string>(
      'GOOGLE_PLACES_TEXT_SEARCH_URL',
    )!;

    const payload = {
      textQuery: query,
      locationBias: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: 500.0,
        },
      },
    };

    const response = await httpClient.post(URL, payload, {
      headers: {
        'X-Goog-Api-Key': `${this.configService.get<string>('GOOGLE_API_KEY')!}`,
        'X-Goog-FieldMask':
          'places.displayName,places.formattedAddress,places.priceLevel,places.id,places.types',
      },
    });
  }

  async getPlaceReviewByPlaceId(placeId: string): Promise<GoogleReview[]> {
    const URL = `${this.configService.get<string>('GOOGLE_PLACES_REVIEW_URL')!}/${placeId}`;

    const response = await httpClient.get(URL, {
      headers: {
        'X-Goog-Api-Key': `${this.configService.get<string>('GOOGLE_API_KEY')!}`,
        'X-Goog-FieldMask': 'id,displayName,reviews,rating',
      },
    });

    const { reviews, displayName, id, rating } = response.data;

    const results: GoogleReview[] = reviews.map(
      (review): GoogleReview => ({
        ...review,
        googlePlaceId: id,
        rating,
        listingName: displayName.text,
      }),
    );

    return results ?? [];
  }
}
