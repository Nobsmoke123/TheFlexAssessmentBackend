import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HostawayAdapter } from './hostaway/hostaway.adapter';
import { HostawayFetcher } from './hostaway/hostaway.fetcher';
import { GoogleAdapter } from './google/google.adapter';
import { GoogleFetcher } from './google/google.fetcher';

@Module({
  imports: [ConfigModule],
  providers: [HostawayAdapter, HostawayFetcher, GoogleAdapter, GoogleFetcher],
  exports: [HostawayFetcher, GoogleFetcher],
})
export class IntegrationsModule {}
