import { BaseEntity } from './base.entity';

// src/domain/entities/user.entity.ts
export interface UserEntity extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
  roles: string[];
}
