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
      const raw = model.order_total_amount_history as any;
      try {
        if (Array.isArray(raw)) {
          return raw.map((entry) => {
            // entries may be either objects or JSON strings
            let item: any = entry;
            if (typeof entry === 'string') {
              try {
                item = JSON.parse(entry);
              } catch (e) {
                return { time: undefined, totalAmount: undefined };
              }
            }
            return { time: item.time, totalAmount: item.total_amount };
          });
        }
        if (typeof raw === 'string' && raw.length) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.map((entry: any) => ({ time: entry.time, totalAmount: entry.total_amount }));
          }
        }
      } catch (e) {
        // fallthrough to empty array
      }
      return [];
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
      const item = typeof entry === 'string' ? JSON.parse(entry) : entry;
      const time = item.time ?? String(item.time ?? '');
      const total = item.totalAmount ?? item.total_amount ?? 0;
      return { time: String(time), totalAmount: Number(total) } as unknown as {
        time: string;
        totalAmount: number;
      };
    });
    // store as array/object so Objection/pg can marshal to JSONB
    const modelArr = arr.map((e) => ({ time: e.time, total_amount: e.totalAmount }));
  patch.order_total_amount_history = JSON.parse(JSON.stringify(modelArr)) as never;
  }

  return patch;
}
