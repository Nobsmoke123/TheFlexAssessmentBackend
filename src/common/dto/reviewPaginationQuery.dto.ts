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
  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsPositive()
  @IsNumber()
  channelId?: number;

  @IsOptional()
  @IsString()
  @IsEnum(ReviewType, {
    message: `Invalid 'reviewType'. Must be either 'host-to-guest' or 'guest-to-host'.`,
  })
  reviewType?: ReviewType;

  @IsOptional()
  @IsString()
  @IsEnum(ReviewStatus, {
    message: `Invalid 'status'. Must be either 'pending' or 'published'.`,
  })
  status?: ReviewStatus;

  @IsOptional()
  @IsString()
  @IsDateString({ strict: true })
  from?: string;

  @IsOptional()
  @IsString()
  @IsDateString({ strict: true })
  to?: string;

  @IsOptional()
  @IsString()
  @IsEnum(ReviewSource, {
    message: `Invalid 'source'. Must be either 'HOSTAWAY', 'GOOGLE', or 'OTHERS'`,
  })
  source?: ReviewSource;
}
