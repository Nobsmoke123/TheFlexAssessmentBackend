import { ConflictException, Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { ReviewPaginationQueryDto } from 'src/reviews/dto/reviewPaginationQuery.dto';
import {
  NormalizedReview,
  PaginatedResponse,
  ReviewStatus,
} from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listReviews(
    reviewPaginationQueryDto: ReviewPaginationQueryDto,
  ): Promise<PaginatedResponse<Review, 'reviews'>> {
    const {
      propertyId,
      channelId,
      reviewType,
      status,
      from,
      to,
      source,
      limit = 10,
      cursor,
    } = reviewPaginationQueryDto;

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

    if (reviewType) {
      where.type = reviewType;
    }

    if (status) {
      where.status = status;
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

  async listReviewsByPropertyId() {}

  async createReviews(
    reviews: NormalizedReview[],
    reviewPaginationQuery: ReviewPaginationQueryDto,
  ) {
    for (let review of reviews) {
      await this.prisma.$transaction(async (transaction) => {
        // Get the propertyId
        const property = await transaction.property.findUnique({
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
        const createdReview = await transaction.review.upsert({
          where: {
            source_sourceReviewId: {
              source: review.source,
              sourceReviewId: review.sourceReviewId,
            },
          },
          create: {
            property: {
              connect: {
                id: property.id,
              },
            },
            channel: {
              connect: {
                id: review.channelId,
              },
            },
            source: review.source,
            sourceReviewId: review.sourceReviewId,
            type: review.type,
            authorName: review.authorName,
            status: review.status,
            raw: review.raw,
            content: review.content,
            rating: review.rating ?? 10,
            ...(review.authorAvatarUrl && {
              authorAvatarUrl: review.authorAvatarUrl,
            }),
          },
          update: {
            content: review.content,
            rating: review.rating ?? 10,
          },
        });

        // Add the review category if it exists.
        if (review.subScores) {
          for (const score of review.subScores) {
            await transaction.reviewCategory.upsert({
              where: {
                reviewId_categoryName: {
                  reviewId: createdReview.id,
                  categoryName: score.category,
                },
              },
              create: {
                review: {
                  connect: {
                    id: createdReview.id,
                  },
                },
                categoryName: score.category,
                score: score.rating ?? 10,
              },
              update: {
                score: score.rating ?? 10,
              },
            });
          }
        }
      });
    }

    return this.listReviews(reviewPaginationQuery);
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
        status: ReviewStatus.REJECTED,
      },
    });
  }

  async getAllPropertiesWithGooglePlaceId() {
    return this.prisma.property.findMany({
      where: { googlePlaceId: { not: null } },
      select: { id: true, googlePlaceId: true },
    });
  }
}
