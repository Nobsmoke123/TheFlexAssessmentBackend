import axios from 'axios';
import path from 'path';
import { GoogleAdapter } from './google.adapter';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleFetcher {
  constructor(
    private readonly adapter: GoogleAdapter,
    private readonly configService: ConfigService,
  ) {}

  async findPlaceIdByTextSearch(
    query: string,
    latitude: number,
    longitude: number,
    radius: number = 500,
  ) {}
}
