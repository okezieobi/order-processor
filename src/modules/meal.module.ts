// src/modules/meal.module.ts
import { Module } from '@nestjs/common';
import { MealController } from '../interfaces/http/controllers/meal.controller';
import { MealService } from '../application/services/meal.service';
import { MealRepository } from '../domain/repositories/meal.repository';
import { ObjectionMealRepository } from '../infrastructure/objection/repositories/objection_meal.repository';

@Module({
  controllers: [MealController],
  providers: [
    MealService,
    { provide: MealRepository, useClass: ObjectionMealRepository },
  ],
})
export class MealModule {}
