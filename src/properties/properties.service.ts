import { Injectable } from '@nestjs/common';
import { PropertyRepository } from './properties.repository';

@Injectable()
export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async listAll(limit: number, cursor?: string) {
    return this.propertyRepository.listAll(limit, cursor);
  }

  async listAllAdmin(limit: number, cursor?: string) {
    return this.propertyRepository.listAllAdmin(limit, cursor);
  }

  async getOne(
    propertyId: string,
  ) {
    return this.propertyRepository.getOne(propertyId);
  }
}
