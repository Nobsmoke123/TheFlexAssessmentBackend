import { NormalizedReview, ReviewSource, ReviewStatus } from 'src/common/types';
import { IntegrationAdapter } from '../adapter';
import { Injectable } from '@nestjs/common';
import { HostawayReview } from '../types/types';

@Injectable()
export class HostawayAdapter extends IntegrationAdapter {
  normalize(review: HostawayReview): NormalizedReview {
    const subScores = review.reviewCategory;

    let normalizedRating = 0;

    // 1. Use review.rating if available
    if (typeof review.rating === 'number') {
      normalizedRating = review.rating;
    }

    // 2. Otherwise, average the subScores
    else if (Array.isArray(subScores) && subScores.length > 0) {
      const total = subScores.reduce((sum, score) => sum + score.rating, 0);
      normalizedRating = total / subScores.length;
    }

    return {
      source: ReviewSource.HOSTAWAY,
      sourceReviewId: `${review.id}`,
      type: review.type,
      status: ReviewStatus.PENDING,
      content: review.publicReview,
      rating: normalizedRating,
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
