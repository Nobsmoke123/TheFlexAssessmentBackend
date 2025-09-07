import { Injectable, NotFoundException } from '@nestjs/common';
import { Property } from '@prisma/client';
import { PaginatedResponse } from 'src/common/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listAll(
    limit: number,
    cursor?: string,
  ): Promise<PaginatedResponse<Property, 'properties'>> {
    const result = await this.prisma.property.findMany({
      include: {
        images: true,
        reviews: {
          where: {
            status: 'published',
          },
          select: {
            authorName: true,
            content: true,
            createdAt: true,
            id: true,
            propertyId: true,
            rating: true,
            source: true,
            sourceReviewId: true,
            status: true,
            type: true,
            updatedAt: true,
            channel: true,
          },
        },
      },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: [{ createdAt: 'asc' }],
    });

    const hasNext = result.length > limit;

    const properties = hasNext ? result.slice(0, limit) : result;

    const nextCursorValue = hasNext
      ? properties[properties.length - 1]?.id
      : null;

    return {
      properties,
      nextCursorValue,
      numberOfRecords: properties.length,
    };
  }

  async listAllAdmin(
    limit: number,
    cursor?: string,
  ): Promise<PaginatedResponse<Property, 'properties'>> {
    const result = await this.prisma.property.findMany({
      include: {
        images: true,
        reviews: {
          select: {
            authorName: true,
            content: true,
            createdAt: true,
            id: true,
            propertyId: true,
            rating: true,
            source: true,
            sourceReviewId: true,
            status: true,
            type: true,
            updatedAt: true,
            channel: true,
          },
        },
      },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: [{ createdAt: 'asc' }],
    });

    const hasNext = result.length > limit;

    const properties = hasNext ? result.slice(0, limit) : result;

    const nextCursorValue = hasNext
      ? properties[properties.length - 1]?.id
      : null;

    return {
      properties,
      nextCursorValue,
      numberOfRecords: properties.length,
    };
  }

  async getOne(propertyId: string): Promise<Property> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        reviews: {
          where: {
            status: 'pending',
          },
          select: {
            authorName: true,
            content: true,
            createdAt: true,
            id: true,
            propertyId: true,
            rating: true,
            source: true,
            sourceReviewId: true,
            status: true,
            type: true,
            updatedAt: true,
            channel: true,
          },
        },
        images: true,
        houseRules: true,
        cancellationPolicies: true,
        amenities: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found.`);
    }

    return property;
  }
}
