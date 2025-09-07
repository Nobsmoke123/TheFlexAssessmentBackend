import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { ReviewsRepository } from './reviews.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IntegrationsModule } from 'src/integrations/integrations.module';

@Module({
  imports: [PrismaModule, IntegrationsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}
