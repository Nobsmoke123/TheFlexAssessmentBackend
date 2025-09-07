import * as fs from 'node:fs/promises';
import * as path from 'path';
import { HostawayAdapter } from './hostaway.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { resilientRequest } from 'utils/http.circuit';

@Injectable()
export class HostawayFetcher {
  constructor(
    private readonly adapter: HostawayAdapter,
    private readonly configService: ConfigService,
  ) {}

  async fetchMockReviews(mockReviewPath?: string) {
    const reviewPath =
      mockReviewPath ??
      path.join(process.cwd(), 'scripts/data/mock-hostaway-reviews.json');
    const raw = await fs.readFile(reviewPath, 'utf-8');
    const json = JSON.parse(raw);
    return json.result;
  }

  async fetchLive() {
    const URL = `${this.configService.get<string>('HOSTAWAY_API_BASE_URL')}/reviews`;

    const response = await resilientRequest({
      url: URL,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.configService.get<string>('HOSTAWAY_API_KEY')}`,
      },
    });

    return response.result ?? [];
  }

  async fetchAndNormalize({ useMock = true } = {}) {
    const reviews =
      useMock || this.configService.get<boolean>('HOSTAWAY_USE_MOCK') === true
        ? await this.fetchMockReviews()
        : await this.fetchLive();
    return this.adapter.normalizeBulk(reviews);
  }
}
