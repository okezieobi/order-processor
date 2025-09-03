// src/infrastructure/objection/mappers/meal.mapper.ts
import { MealModel } from '../models/meal.model';
import { MealEntity } from '../../../domain/entities/meal.entity';

type FieldMap = ReadonlyArray<readonly [keyof MealEntity, keyof MealModel]>;

const fieldMap: FieldMap = [
  ['brandId', 'brand_id'],
  ['name', 'name'],
  ['amount', 'amount'],
  ['active', 'active'],
] as const;

export function toMealEntity(model: MealModel): MealEntity {
  const entity = {
    id: model.id,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  } as MealEntity;

  for (const [entityKey, modelKey] of fieldMap) {
    entity[entityKey] = model[modelKey] as never;
  }

  return entity;
}

export function fromMealEntityPatch(
  entity: Partial<MealEntity>,
): Partial<MealModel> {
  const patch: Partial<MealModel> = {};

  for (const [entityKey, modelKey] of fieldMap) {
    const value = entity[entityKey];
    if (value !== undefined) {
      patch[modelKey] = value as never;
    }
  }

  return patch;
}
