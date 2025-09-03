// src/infrastructure/objection/mappers/order.mapper.ts
import { OrderModel } from '../models/order.model';
import { OrderEntity } from '../../../domain/entities/order.entity';

type FieldMap = ReadonlyArray<readonly [keyof OrderEntity, keyof OrderModel]>;

const fieldMap: FieldMap = [
  ['userId', 'user_id'],
  ['orderCode', 'order_code'],
  ['calculatedOrderId', 'calculated_order_id'],
  ['orderTypeId', 'order_type_id'],

  ['completed', 'completed'],
  ['cancelled', 'cancelled'],
  ['kitchenCancelled', 'kitchen_cancelled'],
  ['kitchenAccepted', 'kitchen_accepted'],
  ['kitchenPrepared', 'kitchen_prepared'],
  ['kitchenDispatched', 'kitchen_dispatched'],
  ['riderAssigned', 'rider_assigned'],
  ['paid', 'paid'],

  ['kitchenDispatchedTime', 'kitchen_dispatched_time'],
  ['kitchenCompletedTime', 'kitchen_completed_time'],
  ['kitchenVerifiedTime', 'kitchen_verified_time'],
  ['completedTime', 'completed_time'],
] as const;

export function toOrderEntity(model: OrderModel): OrderEntity {
  const entity = {
    id: model.id,
    createdAt: model.created_at,
    updatedAt: model.updated_at,

    orderTotalAmountHistory: model.order_total_amount_history.map((entry) => ({
      time: entry.time,
      total_amount: entry.total_amount,
    })),
  } as OrderEntity;

  for (const [entityKey, modelKey] of fieldMap) {
    entity[entityKey] = model[modelKey] as never;
  }

  return entity;
}

export function fromOrderEntityPatch(
  entity: Partial<OrderEntity>,
): Partial<OrderModel> {
  const patch: Partial<OrderModel> = {};

  for (const [entityKey, modelKey] of fieldMap) {
    const value = entity[entityKey];
    if (value !== undefined) {
      patch[modelKey] = value as never;
    }
  }

  if (entity.orderTotalAmountHistory !== undefined) {
    patch.order_total_amount_history = entity.orderTotalAmountHistory.map(
      (entry) => ({
        time: entry.time,
        total_amount: entry.total_amount,
      }),
    );
  }

  return patch;
}
