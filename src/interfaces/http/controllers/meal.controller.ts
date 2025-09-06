import { ApiBody, ApiResponse } from '@nestjs/swagger';
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
  @ApiBody({ type: CreateMealDto, examples: { a: { summary: 'Create meal', value: { name: 'Burger', active: true, brandId: 'a_brand_id', amount: 10 } } } })
  @ApiResponse({ status: 201, description: 'The meal has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() data: CreateMealDto) {
    return this.service.create(data);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The found meal record' })
  @ApiResponse({ status: 404, description: 'Meal not found.' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('admins')
  @ApiBody({ type: UpdateMealDto, examples: { a: { summary: 'Update meal', value: { name: 'Cheeseburger', amount: 12 } } } })
  @ApiResponse({ status: 200, description: 'The meal has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() data: UpdateMealDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Roles('admins')
  @ApiResponse({ status: 200, description: 'The meal has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'A list of meals.' })
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }
}
