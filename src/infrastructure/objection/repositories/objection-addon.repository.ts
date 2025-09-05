import { AddonRepository } from '../../../domain/repositories/addon.repository';
import type { AddonEntity } from '../../../domain/entities/addon.entity';
import { AddonModel } from '../models/addon.model';
import { toAddonEntity, fromAddonEntityPatch } from '../mappers/addon.mapper';
import { Knex } from 'knex';
import { Page } from 'objection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectionAddonRepository extends AddonRepository {
  async create(
    addon: Partial<AddonEntity>,
    tx?: Knex.Transaction,
  ): Promise<AddonEntity> {
    const created = await AddonModel.query(tx).insert(
      fromAddonEntityPatch(addon),
    );
    return toAddonEntity(created);
  }
  async findById(id: string, tx?: Knex.Transaction) {
    const found = await AddonModel.query(tx).findById(id);
    return found ? toAddonEntity(found) : null;
  }
  async update(id: string, patch: Partial<AddonEntity>, tx?: Knex.Transaction) {
    const updated = await AddonModel.query(tx).patchAndFetchById(
      id,
      fromAddonEntityPatch(patch),
    );
    return updated ? toAddonEntity(updated) : null;
  }
  async remove(id: string, tx?: Knex.Transaction) {
    await AddonModel.query(tx).deleteById(id);
  }
  async page(page: number, limit: number, tx?: Knex.Transaction) {
    const { results, total }: Page<AddonModel> = await AddonModel.query(
      tx,
    ).page(Math.max(0, page - 1), limit);
    return { data: results.map(toAddonEntity), total };
  }
}
