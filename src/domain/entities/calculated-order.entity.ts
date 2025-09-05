import { BaseEntity } from './base.entity';

// src/domain/entities/calculated-order.entity.ts
export interface CalculatedOrderEntity extends BaseEntity {
  totalAmount: number;
  freeDelivery: boolean;
  deliveryFee: number;
  serviceCharge: number;
  addressDetails: Record<string, any>;
  lat?: string;
  lng?: string;
  pickup: boolean;
}
