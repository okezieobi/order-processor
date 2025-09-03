// src/domain/entities/addon.entity.ts
export interface AddonEntity {
  id: string;
  name: string;
  amount: number;
  brandId?: string;
  createdAt?: string;
  updatedAt?: string;
}
