// src/infrastructure/objection/mappers/addon.mapper.ts
import { AddonModel } from '../models/addon.model';
import { AddonEntity } from '../../../domain/entities/addon.entity';

type FieldMap = ReadonlyArray<readonly [keyof AddonEntity, keyof AddonModel]>;

const fieldMap: FieldMap = [
  ['name', 'name'],
  ['amount', 'amount'],
  ['brandId', 'brand_id'],
] as const;

export function toAddonEntity(model: AddonModel): AddonEntity {
  const entity = {
    id: model.id,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  } as AddonEntity;

  for (const [entityKey, modelKey] of fieldMap) {
    entity[entityKey] = model[modelKey] as never;
  }

  return entity;
}

export function fromAddonEntityPatch(
  entity: Partial<AddonEntity>,
): Partial<AddonModel> {
  const patch: Partial<AddonModel> = {};

  for (const [entityKey, modelKey] of fieldMap) {
    const value = entity[entityKey];
    if (value !== undefined) {
      patch[modelKey] = value as never;
    }
  }

  return patch;
}
