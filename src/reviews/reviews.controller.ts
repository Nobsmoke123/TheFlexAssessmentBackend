import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewPaginationQueryDto } from 'src/common/dto/reviewPaginationQuery.dto';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewsService) {}

  @Get('hostaway')
  async hostaway(@Query() reviewPaginationQueryDto: ReviewPaginationQueryDto) {
    const data = await this.reviewService.fetchHostawayNormalized(
      reviewPaginationQueryDto,
    );
    return data;
  }

  @Get()
  async list(@Query() reviewPaginationQueryDto: ReviewPaginationQueryDto) {
    const results = await this.reviewService.findAll(reviewPaginationQueryDto);
    return results;
  }

  @Patch(':id/approve')
  async approve(@Param('id') reviewId: string) {
    const response = await this.reviewService.approveReview(reviewId);
    return response;
  }
}
