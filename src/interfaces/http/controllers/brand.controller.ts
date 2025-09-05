// src/interfaces/http/controllers/brand.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { BrandService } from '../../../application/services/brand.service';
import { CreateBrandDto } from '../dto/brands/create-brand.dto';
import { UpdateBrandDto } from '../dto/brands/update-brand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly service: BrandService) {}

  @Post()
  create(@Body() data: CreateBrandDto) {
    return this.service.create(data);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateBrandDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get()
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }
}
