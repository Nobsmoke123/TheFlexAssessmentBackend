import { PartialType } from '@nestjs/mapped-types';
import { PaginationQueryDto } from './paginationQuery.dto';
import { ReviewSource, ReviewStatus, ReviewType } from '../types';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class ReviewPaginationQueryDto extends PartialType(PaginationQueryDto) {
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
    message: `Invalid 'status'. Must be either 'pending' or 'published'.`,
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
}
