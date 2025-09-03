// src/domain/entities/meal.entity.ts
export interface MealEntity {
  id: string;
  name: string;
  active: boolean;
  brandId?: string;
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}
