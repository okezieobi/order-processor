// src/application/services/brand.service.ts
import { Injectable } from '@nestjs/common';
import { MealRepository } from '../../domain/repositories/meal.repository';
import { MealEntity } from '../../domain/entities/meal.entity';
import { BaseService } from './base.service';

@Injectable()
export class MealService extends BaseService<MealEntity> {
  constructor(repo: MealRepository) {
    super(repo);
  }
}
