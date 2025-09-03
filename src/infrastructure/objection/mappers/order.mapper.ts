// src/infrastructure/objection/mappers/order.mapper.ts
import { OrderModel } from '../models/order.model';
import { OrderEntity } from '../../../domain/entities/order.entity';

export function toOrderEntity(model: OrderModel): OrderEntity {
  return {
    id: model.id, // from BaseEntity
    createdAt: model.created_at, // from BaseEntity
    updatedAt: model.updated_at, // from BaseEntity

    userId: model.user_id,
    orderCode: model.order_code,
    calculatedOrderId: model.calculated_order_id,
    orderTypeId: model.order_type_id,

    completed: model.completed,
    cancelled: model.cancelled,
    kitchenCancelled: model.kitchen_cancelled,
    kitchenAccepted: model.kitchen_accepted,
    kitchenPrepared: model.kitchen_prepared,
    kitchenDispatched: model.kitchen_dispatched,
    riderAssigned: model.rider_assigned,
    paid: model.paid,

    kitchenDispatchedTime: model.kitchen_dispatched_time,
    kitchenCompletedTime: model.kitchen_completed_time,
    kitchenVerifiedTime: model.kitchen_verified_time, // ✅ type-safe now
    completedTime: model.completed_time,

    orderTotalAmountHistory: model.order_total_amount_history.map((entry) => ({
      time: entry.time,
      total_amount: entry.total_amount,
    })),
  };
}
