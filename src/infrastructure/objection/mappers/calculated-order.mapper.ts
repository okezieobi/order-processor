// src/infrastructure/objection/mappers/calculated_order.mapper.ts
import { CalculatedOrderModel } from '../models/calculated-order.model';
import { CalculatedOrderEntity } from '../../../domain/entities/calculated-order.entity';

type FieldMap = ReadonlyArray<
  readonly [keyof CalculatedOrderEntity, keyof CalculatedOrderModel]
>;

// Note: The model is missing fields: addressDetails, lat, lng, pickup.
// The entity is missing the 'items' relation.
// This mapper is incomplete due to these discrepancies.
const fieldMap: FieldMap = [
  ['totalAmount', 'total_amount'],
  ['freeDelivery', 'free_delivery'],
  ['deliveryFee', 'delivery_fee'],
  ['serviceCharge', 'service_charge'],
] as const;

export function toCalculatedOrderEntity(
  model: CalculatedOrderModel,
): CalculatedOrderEntity {
  const entity = {
    id: model.id,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  } as CalculatedOrderEntity;

  for (const [entityKey, modelKey] of fieldMap) {
    entity[entityKey] = model[modelKey] as never;
  }

  // Note: 'items' from the model is not mapped to the entity.

  return entity;
}

export function fromCalculatedOrderEntityPatch(
  entity: Partial<CalculatedOrderEntity>,
): Partial<CalculatedOrderModel> {
  const patch: Partial<CalculatedOrderModel> = {};

  for (const [entityKey, modelKey] of fieldMap) {
    const value = entity[entityKey];
    if (value !== undefined) {
      patch[modelKey] = value as never;
    }
  }

  // Note: fields not in the model are not patched: addressDetails, lat, lng, pickup.

  return patch;
}
