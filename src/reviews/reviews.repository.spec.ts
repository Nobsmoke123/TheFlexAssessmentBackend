import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsRepository } from './reviews.repository';

describe('ReviewsRepository', () => {
  let provider: ReviewsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewsRepository],
    }).compile();

    provider = module.get<ReviewsRepository>(ReviewsRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
