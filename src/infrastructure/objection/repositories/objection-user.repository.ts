import { UserRepository } from '../../../domain/repositories/user.repository';
import type { UserEntity } from '../../../domain/entities/user.entity';
import { UserModel } from '../models/user.model';
import { toUserEntity, fromUserEntityPatch } from '../mappers/user.mapper';
import { Knex } from 'knex';
import { Page } from 'objection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectionUserRepository extends UserRepository {
  async create(
    user: Partial<UserEntity>,
    tx?: Knex.Transaction,
  ): Promise<UserEntity> {
    const patch = fromUserEntityPatch(user);
    // Normalize roles: ensure we send valid JSON to jsonb column
    if (patch.roles !== undefined) {
      if (Array.isArray(patch.roles)) {
        patch.roles = JSON.stringify(patch.roles) as never;
      } else if (typeof patch.roles === 'string') {
        // leave string as-is (may already be JSON)
      } else {
        patch.roles = JSON.stringify([]) as never;
      }
    }

    const created = await UserModel.query(tx).insert(patch);
    return toUserEntity(created);
  }
  // async findById(id: string, tx?: Knex.Transaction) {
  //   const found = await UserModel.query(tx).findById(id);
  //   return found ? toUserEntity(found) : null;
  // }
  async findByEmail(email: string, tx?: Knex.Transaction) {
    const found = await UserModel.query(tx).findOne({ email });
    return found ? toUserEntity(found) : null;
  }
  async findById(id: string, tx?: Knex.Transaction) {
    const found = await UserModel.query(tx).findById(id);
    return found ? toUserEntity(found) : null;
  }
  async update(id: string, patch: Partial<UserEntity>, tx?: Knex.Transaction) {
    const modelPatch = fromUserEntityPatch(patch);
    if (modelPatch.roles !== undefined) {
      if (Array.isArray(modelPatch.roles)) {
        modelPatch.roles = JSON.stringify(modelPatch.roles) as never;
      } else if (typeof modelPatch.roles === 'string') {
        // ok
      } else {
        modelPatch.roles = JSON.stringify([]) as never;
      }
    }

    const updated = await UserModel.query(tx).patchAndFetchById(id, modelPatch);
    return updated ? toUserEntity(updated) : null;
  }
  async remove(id: string, tx?: Knex.Transaction) {
    await UserModel.query(tx).deleteById(id);
  }
  async page(page: number, limit: number, tx?: Knex.Transaction) {
    const { results, total }: Page<UserModel> = await UserModel.query(tx).page(
      Math.max(0, page - 1),
      limit,
    );
    return { data: results.map(toUserEntity), total };
  }
}
