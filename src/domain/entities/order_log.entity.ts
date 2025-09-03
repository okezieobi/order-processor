// src/domain/entities/order-log.entity.ts
export interface OrderLogEntity {
  id: string;
  orderId: string;
  time: string;
  description: string;
}
