// src/infrastructure/objection/mappers/user.mapper.ts
import { UserModel } from '../models/user.model';
import { UserEntity } from '../../../domain/entities/user.entity';

type FieldMap = ReadonlyArray<readonly [keyof UserEntity, keyof UserModel]>;

const fieldMap: FieldMap = [
  ['firstName', 'first_name'],
  ['lastName', 'last_name'],
  ['email', 'email'],
  ['phone', 'phone'],
  ['isActive', 'is_active'],
  ['roles', 'roles'],
] as const;

export function toUserEntity(model: UserModel): UserEntity {
  const entity = {
    id: model.id,
    createdAt: model.created_at,
    updatedAt: model.updated_at,
  } as UserEntity;

  for (const [entityKey, modelKey] of fieldMap) {
    entity[entityKey] = model[modelKey] as never;
  }

  // Note: 'orders' from the model is not mapped to the entity.
  // Note: 'password_hash' is intentionally not exposed in the entity.

  return entity;
}

export function fromUserEntityPatch(
  entity: Partial<UserEntity>,
): Partial<UserModel> {
  const patch: Partial<UserModel> = {};

  for (const [entityKey, modelKey] of fieldMap) {
    const value = entity[entityKey];
    if (value !== undefined) {
      patch[modelKey] = value as never;
    }
  }

  return patch;
}
