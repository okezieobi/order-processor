// src/infrastructure/objection/mappers/brand.mapper.ts
import { BrandModel } from '../models/brand.model';
import { BrandEntity } from '../../../domain/entities/brand.entity';

export function toBrandEntity(model: BrandModel): BrandEntity {
  return {
    id: model.id,
    name: model.name,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  };
}

export function fromBrandEntityPatch(
  entity: Partial<BrandEntity>,
): Partial<BrandModel> {
  const patch: Partial<BrandModel> = {};
  if (entity.name !== undefined) {
    patch.name = entity.name;
  }
  return patch;
}
