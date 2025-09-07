import { Controller, Get, Param, Query } from '@nestjs/common';
import { PropertyService } from './properties.service';
import { PaginationQueryDto } from 'src/common/dto/paginationQuery.dto';

@Controller('api/properties')
export class PropertiesController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  async findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    const { limit = 10, cursor } = paginationQueryDto;
    return this.propertyService.listAll(limit, cursor);
  }

  @Get('/admin')
  async adminListAll(@Query() paginationQueryDto: PaginationQueryDto) {
    const { limit = 10, cursor } = paginationQueryDto;
    return this.propertyService.listAllAdmin(limit, cursor);
  }

  @Get(':id')
  async findOne(@Param('id') propertyId: string) {
    return this.propertyService.getOne(propertyId);
  }
}
