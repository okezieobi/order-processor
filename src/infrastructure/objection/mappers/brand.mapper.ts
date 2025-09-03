// src/infrastructure/objection/mappers/brand.mapper.ts
import { BrandModel } from '../models/brand.model';
import { BrandEntity } from '../../../domain/entities/brand.entity';

type FieldMap = ReadonlyArray<readonly [keyof BrandEntity, keyof BrandModel]>;

const fieldMap: FieldMap = [['name', 'name']] as const;

export function toBrandEntity(model: BrandModel): BrandEntity {
  const entity = {
    id: model.id,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  } as BrandEntity;

  for (const [entityKey, modelKey] of fieldMap) {
    entity[entityKey] = model[modelKey] as never;
  }

  return entity;
}

export function fromBrandEntityPatch(
  entity: Partial<BrandEntity>,
): Partial<BrandModel> {
  const patch: Partial<BrandModel> = {};

  for (const [entityKey, modelKey] of fieldMap) {
    const value = entity[entityKey];
    if (value !== undefined) {
      patch[modelKey] = value as never;
    }
  }

  return patch;
}
