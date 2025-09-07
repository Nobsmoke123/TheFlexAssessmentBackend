import { Injectable } from '@nestjs/common';
import { NormalizedReview } from 'src/common/types';
import { GoogleFetcher } from 'src/integrations/google/google.fetcher';
import { HostawayFetcher } from 'src/integrations/hostaway/hostaway.fetcher';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly hostaway: HostawayFetcher,
    private readonly google: GoogleFetcher,
    private readonly reviewRepository: ReviewsRepository,
  ) {}

  async fetchHostawayNormalized() {
    const normalized = await this.hostaway.fetchAndNormalize({
      useMock: process.env.HOSTAWAY_USE_MOCK === 'true',
    });

    const reviews = await this.upsertNormalizedReviews(normalized);

    return reviews;
  }

  async upsertNormalizedReviews(reviews: NormalizedReview[]) {
    return this.reviewRepository.createReviews(reviews);
  }

  async fetchGoogleReviewsForProperty(googlePlaceId: string) {
    // const normalized = await this.google.
  }
}
