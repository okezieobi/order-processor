// src/domain/entities/order.entity.ts
export interface OrderTotalHistoryEntry {
  time: string;
  total_amount: number;
}

export interface OrderEntity {
  id: string;
  userId: string;
  orderCode?: string;
  calculatedOrderId?: string;
  orderTypeId?: string;

  completed: boolean;
  cancelled: boolean;
  kitchenCancelled: boolean;
  kitchenAccepted: boolean;
  kitchenPrepared: boolean;
  kitchenDispatched: boolean;
  riderAssigned: boolean;
  paid: boolean;

  kitchenDispatchedTime?: string;
  kitchenCompletedTime?: string;
  kitchenVerifiedTime?: string;
  completedTime?: string;

  orderTotalAmountHistory: OrderTotalHistoryEntry[];
  createdAt?: string;
  updatedAt?: string;
}
