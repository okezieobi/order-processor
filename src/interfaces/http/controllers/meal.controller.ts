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
import { MealEntity } from '../../../domain/entities/meal.entity';

@Controller('meals')
export class MealController {
  constructor(private readonly service: MealService) {}

  @Post()
  create(@Body() data: MealEntity) {
    return this.service.create(data);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<MealEntity>) {
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
