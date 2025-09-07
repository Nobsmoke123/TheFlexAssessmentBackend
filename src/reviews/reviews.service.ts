import { Injectable } from '@nestjs/common';
import { NormalizedReview } from 'src/common/types';
import { GoogleFetcher } from 'src/integrations/google/google.fetcher';
import { HostawayFetcher } from 'src/integrations/hostaway/hostaway.fetcher';
import { ReviewsRepository } from './reviews.repository';
import { ReviewPaginationQueryDto } from 'src/reviews/dto/reviewPaginationQuery.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly hostaway: HostawayFetcher,
    private readonly google: GoogleFetcher,
    private readonly reviewRepository: ReviewsRepository,
  ) {}

  async fetchHostawayNormalized(
    reviewPaginationQueryDto: ReviewPaginationQueryDto,
  ) {
    const normalized = await this.hostaway.fetchAndNormalize({
      useMock: process.env.HOSTAWAY_USE_MOCK === 'true',
    });

    const reviews = await this.upsertNormalizedReviews(
      normalized,
      reviewPaginationQueryDto,
    );

    return reviews;
  }

  async upsertNormalizedReviews(
    reviews: NormalizedReview[],
    reviewPaginationQuery: ReviewPaginationQueryDto,
  ) {
    return this.reviewRepository.createReviews(reviews, reviewPaginationQuery);
  }

  async findAll(reviewPaginationQueryDto: ReviewPaginationQueryDto) {
    return this.reviewRepository.listReviews(reviewPaginationQueryDto);
  }

  async approveReview(reviewId: string) {
    return this.reviewRepository.setApproval(reviewId);
  }

  async revokeReview(reviewId: string) {
    return this.reviewRepository.revokeApproval(reviewId);
  }

  async fetchGoogleReviews(reviewPaginationQuery: ReviewPaginationQueryDto) {
    const properties =
      await this.reviewRepository.getAllPropertiesWithGooglePlaceId();

    if (!properties.length) {
      console.warn('No properties with googlePlaceId found');
      return [];
    }
    let allReviews: NormalizedReview[] = [];

    for (const prop of properties) {
      const googleReviews = await this.google.getPlaceReviewByPlaceId(
        prop.googlePlaceId!,
      );

      allReviews.push(...googleReviews);
    }

    const result = await this.reviewRepository.createReviews(
      allReviews,
      reviewPaginationQuery,
    );

    return result;
  }
}
