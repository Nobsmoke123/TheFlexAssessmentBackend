import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesRepository } from './properties.repository';

describe('PropertiesRepository', () => {
  let provider: PropertiesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertiesRepository],
    }).compile();

    provider = module.get<PropertiesRepository>(PropertiesRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
