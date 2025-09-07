import { Injectable } from '@nestjs/common';
import {
  NormalizedReview,
  ReviewSource,
  ReviewStatus,
  ReviewType,
} from 'src/common/types';
import { GoogleFetcher } from 'src/integrations/google/google.fetcher';
import { HostawayFetcher } from 'src/integrations/hostaway/hostaway.fetcher';
import { ReviewsRepository } from './reviews.repository';
import { ReviewPaginationQueryDto } from 'src/common/dto/reviewPaginationQuery.dto';

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

    const reviews = await this.upsertNormalizedReviews(normalized);

    return reviews;
  }

  async upsertNormalizedReviews(reviews: NormalizedReview[]) {
    return this.reviewRepository.createReviews(reviews);
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
}
