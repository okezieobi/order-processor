import { BaseEntity } from './base.entity';

// src/domain/entities/addon.entity.ts
export interface AddonEntity extends BaseEntity {
  name: string;
  amount: number;
  brandId?: string;
}
