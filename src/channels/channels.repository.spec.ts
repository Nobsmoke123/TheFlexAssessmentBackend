import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsRepository } from './channels.repository';

describe('ChannelsRepository', () => {
  let provider: ChannelsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsRepository],
    }).compile();

    provider = module.get<ChannelsRepository>(ChannelsRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
