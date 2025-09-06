import { BaseEntity } from './base.entity';

// src/domain/entities/order.entity.ts
export interface OrderTotalHistoryEntry {
  time: string;
  total_amount: number;
}

export interface OrderEntity extends BaseEntity {
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
  scheduled: boolean;
  isHidden: boolean;
  failedTripDetails: Record<string, any>;
  boxNumber?: string;
}
