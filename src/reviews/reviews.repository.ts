import { ConflictException, Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import {
  NormalizedReview,
  PaginatedResponse,
  ReviewSource,
  ReviewStatus,
  ReviewType,
} from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listReviews(
    propertyId?: string, // filter by property
    channelId?: number, // filter by channel
    reviewType?: ReviewType, // filter by review type
    status?: ReviewStatus, // filter by review status
    from?: string, // filter using date
    to?: string, // filter using date
    source?: ReviewSource,
    limit: number = 10,
    cursor?: string,
  ): Promise<PaginatedResponse<Review, 'reviews'>> {
    const where: Record<string, any> = {};

    if (propertyId) {
      where.propertyId = propertyId;
    }

    if (source) {
      where.source = source;
    }

    if (channelId) {
      where.channelId = channelId;
    }

    if (reviewType === ReviewType.GUEST_TO_HOST) {
      where.type = ReviewType.GUEST_TO_HOST;
    } else {
      where.type = ReviewType.HOST_TO_GUEST;
    }

    if (status === ReviewStatus.PUBLISHED) {
      where.status = ReviewStatus.PUBLISHED;
    } else {
      where.status = ReviewStatus.PENDING;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) {
        where.createdAt.gte = new Date(from);
      }
      if (to) {
        where.createdAt.lte = new Date(to);
      }
    }

    const result = await this.prisma.review.findMany({
      where,
      include: {
        reviewCategory: true,
        channel: true,
        property: {
          select: {
            name: true,
            address: true,
          },
        },
      },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: [{ createdAt: 'desc' }],
    });

    const hasNext = result.length > limit;

    const reviews = hasNext ? result.slice(0, limit) : result;

    const nextCursorValue = hasNext ? reviews[reviews.length - 1]?.id : null;

    return {
      reviews,
      nextCursorValue,
      numberOfRecords: reviews.length,
    };
  }

  async createReviews(reviews: NormalizedReview[]) {
    for (let review of reviews) {
      // Get the propertyId
      const property = await this.prisma.property.findUnique({
        where: {
          internalListingName: review.listingName,
        },
      });

      if (!property) {
        throw new ConflictException(
          `Property with listingName ${review.listingName} not found.`,
        );
      }

      // Create the review
      const createdReview = await this.prisma.review.upsert({
        where: {
          source_sourceReviewId: {
            source: review.source,
            sourceReviewId: review.sourceReviewId,
          },
        },
        create: {
          propertyId: property.id,
          source: review.source,
          sourceReviewId: review.sourceReviewId,
          type: review.type,
          channelId: review.channelId,
          authorName: review.authorName,
          status: review.status,
          raw: review.raw,
          content: review.content,
          rating: review.rating!,
          ...(review.authorAvatarUrl && {
            authorAvatarUrl: review.authorAvatarUrl,
          }),
        },
        update: {
          content: review.content,
          rating: review.rating!,
        },
      });

      // Add the review category if it exists.
      if (review.subScores) {
        for (const score of review.subScores) {
          await this.prisma.reviewCategory.upsert({
            where: {
              reviewId_categoryName: {
                reviewId: createdReview.id,
                categoryName: score.category,
              },
            },
            create: {
              reviewId: createdReview.id,
              categoryName: score.category,
              score: score.rating,
            },
            update: {
              score: score.rating,
            },
          });
        }
      }
    }
    return this.listReviews();
  }

  async setApproval(reviewId: string): Promise<Review> {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        status: ReviewStatus.PUBLISHED,
      },
    });
  }

  async revokeApproval(reviewId: string): Promise<Review> {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: {
        status: ReviewStatus.PENDING,
      },
    });
  }
}
