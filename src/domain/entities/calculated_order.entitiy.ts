// src/domain/entities/calculated-order.entity.ts
export interface CalculatedOrderEntity {
  id: string;
  totalAmount: number;
  freeDelivery: boolean;
  deliveryFee: number;
  serviceCharge: number;
  addressDetails: Record<string, any>;
  lat?: string;
  lng?: string;
  pickup: boolean;
  createdAt?: string;
  updatedAt?: string;
}
