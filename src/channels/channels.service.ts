import { Injectable } from '@nestjs/common';
import { ChannelsRepository } from './channels.repository';

@Injectable()
export class ChannelsService {
  constructor(private readonly channelRepository: ChannelsRepository) {}

  async listAllChannels() {
    return this.channelRepository.listAllChannels();
  }
}
