import {
  ReviewSource,
  ReviewStatus,
  ReviewType,
  SortBy,
  SortOrder,
} from '../../common/types';

import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class ReviewPaginationQueryDto {
  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  channelId?: number;

  @IsString()
  @IsEnum(ReviewType, {
    message: `Invalid 'reviewType'. Must be either 'host-to-guest' or 'guest-to-host'.`,
  })
  @IsOptional()
  reviewType?: ReviewType;

  @IsString()
  @IsEnum(ReviewStatus, {
    message: `Invalid 'status'. Must be either 'pending' or 'published' or 'rejected'.`,
  })
  @IsOptional()
  status?: ReviewStatus;

  @IsString()
  @IsDateString({ strict: true })
  @IsOptional()
  from?: string;

  @IsString()
  @IsDateString({ strict: true })
  @IsOptional()
  to?: string;

  @IsString()
  @IsEnum(ReviewSource, {
    message: `Invalid 'source'. Must be either 'HOSTAWAY', 'GOOGLE', or 'OTHERS'`,
  })
  @IsOptional()
  source?: ReviewSource;

  @IsOptional()
  @IsNumber()
  ratingMin?: number;

  @IsString()
  @IsOptional()
  @IsEnum(SortBy, {
    message: `Invalid 'sortBy'. Must be either 'rating' or 'createdAt'`,
  })
  sortBy?: SortBy;

  @IsString()
  @IsOptional()
  @IsEnum(SortOrder, {
    message: `Invalid 'sortOrder'. Must be either 'asc' or 'desc'`,
  })
  sortOrder?: SortOrder;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  cursor?: string;
}
