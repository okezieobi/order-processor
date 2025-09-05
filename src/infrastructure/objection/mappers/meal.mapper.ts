// src/infrastructure/objection/mappers/meal.mapper.ts
import { MealModel } from '../models/meal.model';
import { MealEntity } from '../../../domain/entities/meal.entity';

export function toMealEntity(model: MealModel): MealEntity {
  return {
    id: model.id,
    name: model.name,
    active: model.active,
    brandId: model.brand_id,
    amount: model.amount,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  };
}

export function fromMealEntityPatch(
  entity: Partial<MealEntity>,
): Partial<MealModel> {
  const patch: Partial<MealModel> = {};
  if (entity.name !== undefined) {
    patch.name = entity.name;
  }
  if (entity.active !== undefined) {
    patch.active = entity.active;
  }
  if (entity.brandId !== undefined) {
    patch.brand_id = entity.brandId;
  }
  if (entity.amount !== undefined) {
    patch.amount = entity.amount;
  }
  return patch;
}
