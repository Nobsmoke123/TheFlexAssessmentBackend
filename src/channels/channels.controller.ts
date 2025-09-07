import { Controller, Get } from '@nestjs/common';
import { ChannelsService } from './channels.service';

@Controller('api/channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  async findAll() {
    return this.channelsService.listAllChannels();
  }
}
