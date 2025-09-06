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
  create(@Body() data: CreateAddonDto) {
    return this.service.create(data);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('admins')
  update(@Param('id') id: string, @Body() data: UpdateAddonDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Roles('admins')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get()
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }
}
