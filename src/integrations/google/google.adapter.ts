import {
  NormalizedReview,
  ReviewSource,
  ReviewStatus,
  ReviewType,
} from 'src/common/types';
import { IntegrationAdapter } from '../adapter';
import { Injectable } from '@nestjs/common';
import { GoogleReview } from '../types/types';

@Injectable()
export class GoogleAdapter extends IntegrationAdapter {
  normalize(review: GoogleReview): NormalizedReview {
    return {
      source: ReviewSource.GOOGLE,
      sourceReviewId: review.name,
      type: ReviewType.GUEST_TO_HOST,
      status: ReviewStatus.PENDING,
      content: review.text.text,
      rating: review.rating,
      channelId: 2022, // default this 2022 for google reviews
      raw: JSON.stringify(review),
      authorName: review.authorAttribution.displayName,
      authorAvatarUrl: review.authorAttribution.photoUri,
      listingName: review.listingName,
      createdAt: review.publishTime
        ? new Date(review.publishTime).toISOString()
        : new Date().toISOString(),
    };
  }
}
