import { BaseEntity } from './base.entity';

// src/domain/entities/meal.entity.ts
export interface MealEntity extends BaseEntity {
  name: string;
  active?: boolean;
  brandId?: string;
  amount: number;
}
