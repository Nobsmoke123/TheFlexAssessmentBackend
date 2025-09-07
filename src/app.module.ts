import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PropertiesModule } from './properties/properties.module';
import { ReviewsModule } from './reviews/reviews.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';
import * as Joi from 'joi';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(process.cwd(), '.env'),
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER_TEST: Joi.string().required(),
        POSTGRES_PASSWORD_TEST: Joi.string().required(),
        POSTGRES_DB_TEST: Joi.string().required(),
        PGADMIN_DEFAULT_EMAIL: Joi.string().required(),
        PGADMIN_DEFAULT_PASSWORD: Joi.string().required(),
        HOSTAWAY_API_KEY: Joi.string().required(),
        HOSTAWAY_API_BASE_URL: Joi.string().required(),
        HOSTAWAY_USE_MOCK: Joi.boolean().required(),
        GOOGLE_PLACES_TEXT_SEARCH_URL: Joi.string().required(),
        GOOGLE_PLACES_REVIEW_URL: Joi.string().required(),
      }),
    }),
    PropertiesModule,
    ReviewsModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
