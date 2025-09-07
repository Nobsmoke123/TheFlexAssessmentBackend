import { NormalizedReview, ReviewStatus } from 'src/common/types';
import { IntegrationAdapter } from '../adapter';
import { Injectable } from '@nestjs/common';
import { HostawayReview } from '../types/types';

@Injectable()
export class HostawayAdapter extends IntegrationAdapter {
  normalize(review: HostawayReview): NormalizedReview {
    return {
      source: 'HOSTAWAY',
      sourceReviewId: `${review.id}`,
      type: review.type,
      status: ReviewStatus.PENDING,
      content: review.publicReview,
      rating: review.rating,
      channelId: review.channelId ?? 2000, // default this to direct reviews on hostaway
      raw: JSON.stringify(review),
      authorName: review.guestName,
      listingName: review.listingName,
      subScores: review.reviewCategory,
      createdAt: review.submittedAt
        ? new Date(review.submittedAt).toISOString()
        : new Date().toISOString(),
    };
  }
}
