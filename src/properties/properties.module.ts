import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertyService } from './properties.service';
import { PropertyRepository } from './properties.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PropertiesController],
  providers: [PropertyService, PropertyRepository],
})
export class PropertiesModule {}
