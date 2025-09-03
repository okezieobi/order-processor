import { BaseEntity } from './base.entity';

// src/domain/entities/order-log.entity.ts
export interface OrderLogEntity extends BaseEntity {
  orderId: string;
  time: string;
  description: string;
}
