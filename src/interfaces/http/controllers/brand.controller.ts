import { ApiBody, ApiResponse } from '@nestjs/swagger';
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
import { Roles } from '../../../common/auth/roles.decorator';
import { CreateBrandDto } from '../dto/brands/create-brand.dto';
import { UpdateBrandDto } from '../dto/brands/update-brand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly service: BrandService) {}

  @Post()
  @Roles('admins')
  @ApiBody({ type: CreateBrandDto, examples: { a: { summary: 'Create brand', value: { name: 'Brand X' } } } })
  @ApiResponse({ status: 201, description: 'The brand has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() data: CreateBrandDto) {
    return this.service.create(data);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The found brand record' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('admins')
  @ApiBody({ type: UpdateBrandDto, examples: { a: { summary: 'Update brand', value: { name: 'Brand Y' } } } })
  @ApiResponse({ status: 200, description: 'The brand has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() data: UpdateBrandDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Roles('admins')
  @ApiResponse({ status: 200, description: 'The brand has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'A list of brands.' })
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }
}
