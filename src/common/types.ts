export enum ReviewSource {
  HOSTAWAY = 'HOSTAWAY',
  GOOGLE = 'GOOGLE',
  OTHER = 'OTHER',
}

export type PaginatedResponse<T, K extends string = 'data'> = {
  [key in K]: T[];
} & { nextCursorValue: string | null; numberOfRecords: number };

export enum ReviewStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
}

export enum ReviewType {
  HOST_TO_GUEST = 'host-to-guest',
  GUEST_TO_HOST = 'guest-to-host',
}

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
