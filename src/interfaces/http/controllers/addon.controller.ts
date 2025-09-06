import { ApiBody, ApiResponse } from '@nestjs/swagger';
// src/interfaces/http/controllers/addon.controller.ts
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
import { AddonService } from '../../../application/services/addon.service';
import { Roles } from '../../../common/auth/roles.decorator';
import { CreateAddonDto } from '../dto/addons/create-addon.dto';
import { UpdateAddonDto } from '../dto/addons/update-addon.dto';

@Controller('addons')
export class AddonController {
  constructor(private readonly service: AddonService) {}

  @Post()
  @Roles('admins')
  @ApiBody({ type: CreateAddonDto, examples: { a: { summary: 'Create addon', value: { name: 'Extra Cheese', amount: 2.5, brandId: 'a_brand_id' } } } })
  @ApiResponse({ status: 201, description: 'The addon has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() data: CreateAddonDto) {
    return this.service.create(data);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The found addon record' })
  @ApiResponse({ status: 404, description: 'Addon not found.' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('admins')
  @ApiBody({ type: UpdateAddonDto, examples: { a: { summary: 'Update addon', value: { name: 'Extra Cheese', amount: 3.0 } } } })
  @ApiResponse({ status: 200, description: 'The addon has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() data: UpdateAddonDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Roles('admins')
  @ApiResponse({ status: 200, description: 'The addon has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'A list of addons.' })
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }
}
