// src/infrastructure/objection/mappers/order.mapper.ts
import { OrderModel } from '../models/order.model';
import { OrderEntity } from '../../../domain/entities/order.entity';
import {
  normalizeOrderTotalAmountHistory,
  NormalizedOrderHistoryEntry,
} from '../utils/order-history-normalizer';

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
  ['scheduled', 'scheduled'],
  ['isHidden', 'is_hidden'],
  ['failedTripDetails', 'failed_trip_details'],
  ['boxNumber', 'box_number'],
] as const;

export function toOrderEntity(model: OrderModel): OrderEntity {
  const entity = {
    id: model.id,
    createdAt: model.created_at,
    updatedAt: model.updated_at,

    // normalize order_total_amount_history which may be stored as JSON string, object, or array
    orderTotalAmountHistory: (() => {
      const raw = (model as unknown as Record<string, unknown>)[
        'order_total_amount_history'
      ];
      const normalized: NormalizedOrderHistoryEntry[] =
        normalizeOrderTotalAmountHistory(raw);
      return normalized.map((e) => ({
        time: e.time,
        totalAmount: e.total_amount,
      }));
    })(),
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
    // Map to domain-shaped entries so mapper stores a clean JSON array.
    const arr = entity.orderTotalAmountHistory.map((entry) => {
      if (typeof entry === 'string') {
        try {
          const parsed: unknown = JSON.parse(entry);
          const rec = parsed as Record<string, unknown>;
          return {
            time:
              typeof rec.time === 'string' || typeof rec.time === 'number'
                ? String(rec.time)
                : '',
            totalAmount: Number(rec.total_amount ?? rec.totalAmount ?? 0),
          };
        } catch {
          return { time: '', totalAmount: 0 };
        }
      }
      const rec = entry as unknown as Record<string, unknown>;
      return {
        time:
          typeof rec.time === 'string' || typeof rec.time === 'number'
            ? String(rec.time)
            : '',
        totalAmount: Number(rec.totalAmount ?? rec.total_amount ?? 0),
      };
    });
    // store as array/object so Objection/pg can marshal to JSONB
    const modelArr = arr.map((e) => ({
      time: e.time,
      total_amount: e.totalAmount,
    }));
    patch.order_total_amount_history = JSON.parse(
      JSON.stringify(modelArr),
    ) as never;
  }

  return patch;
}
