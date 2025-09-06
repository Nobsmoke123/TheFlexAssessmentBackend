// export enum ReviewSource {
//   HOSTAWAY = 'HOSTAWAY',
//   GOOGLE = 'GOOGLE',
//   OTHER = 'OTHER',
// }

export type ReviewSource = 'HOSTAWAY' | 'GOOGLE' | 'OTHER';

// export enum ReviewStatus {
//   PENDING = 'PENDING',
//   PUBLISHED = 'PUBLISHED',
// }

export type ReviewStatus = 'pending' | 'published';

// export enum ReviewType {
//   HOST_TO_GUEST = 'HOST_TO_GUEST',
//   GUEST_TO_HOST = 'GUEST_TO_HOST',
// }

export type ReviewType = 'host-to-guest' | 'guest-to-host';

export interface NormalizedReview {
  source: ReviewSource;
  sourceReviewId: string;
  type: ReviewType;
  channelId: number;
  listingName: string;
  rating?: number;
  content: string;
  authorName: string;
  authorAvatarUrl?: string;
  raw: string;
  status: ReviewStatus;
  subScores?: Array<{
    category: string;
    rating: number;
  }>;
  createdAt: string;
}
