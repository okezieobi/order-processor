// src/domain/entities/user.entity.ts
export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  isActive: boolean;
}
