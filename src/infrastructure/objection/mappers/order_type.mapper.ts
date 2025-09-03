// src/infrastructure/objection/mappers/order_type.mapper.ts
import { OrderTypeModel } from '../models/order_type.model';
import { OrderTypeEntity } from '../../../domain/entities/order_type.entity';

type FieldMap = ReadonlyArray<
  readonly [keyof OrderTypeEntity, keyof OrderTypeModel]
>;

const fieldMap: FieldMap = [['name', 'name']] as const;

export function toOrderTypeEntity(model: OrderTypeModel): OrderTypeEntity {
  const entity = {
    id: model.id,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  } as OrderTypeEntity;

  for (const [entityKey, modelKey] of fieldMap) {
    entity[entityKey] = model[modelKey] as never;
  }

  return entity;
}

export function fromOrderTypeEntityPatch(
  entity: Partial<OrderTypeEntity>,
): Partial<OrderTypeModel> {
  const patch: Partial<OrderTypeModel> = {};

  for (const [entityKey, modelKey] of fieldMap) {
    const value = entity[entityKey];
    if (value !== undefined) {
      patch[modelKey] = value as never;
    }
  }

  return patch;
}
