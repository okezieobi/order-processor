import { MealEntity } from '../entities/meal.entity';
import { BaseRepository } from './base.repository';

export abstract class MealRepository extends BaseRepository<MealEntity> {}
