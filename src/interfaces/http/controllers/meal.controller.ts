// src/interfaces/http/controllers/meal.controller.ts
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
import { MealService } from '../../../application/services/meal.service';
import { Roles } from '../../../common/auth/roles.decorator';
import { CreateMealDto } from '../dto/meal/create-meal.dto';
import { UpdateMealDto } from '../dto/meal/update-meal.dto';

@Controller('meals')
export class MealController {
  constructor(private readonly service: MealService) {}

  @Post()
  @Roles('admins')
  create(@Body() data: CreateMealDto) {
    return this.service.create(data);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('admins')
  update(@Param('id') id: string, @Body() data: UpdateMealDto) {
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
