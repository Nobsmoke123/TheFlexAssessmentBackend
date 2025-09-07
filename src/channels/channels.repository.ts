import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listAllChannels() {
    return this.prisma.channel.findMany();
  }
}
