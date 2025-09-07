import { ReviewSource, ReviewStatus, ReviewType } from '../../common/types';

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
  sortBy?: 'rating' | 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  cursor?: string;
}
