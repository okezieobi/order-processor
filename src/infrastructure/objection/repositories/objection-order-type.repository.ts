
import { OrderTypeRepository } from '../../../domain/repositories/order-type.repository';
import type { OrderTypeEntity } from '../../../domain/entities/order-type.entity';
import { OrderTypeModel } from '../models/order-type.model';
import { toOrderTypeEntity, fromOrderTypeEntityPatch } from '../mappers/order-type.mapper';
import { Knex } from 'knex';
import { Page } from 'objection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectionOrderTypeRepository extends OrderTypeRepository {
  async create(
    orderType: Partial<OrderTypeEntity>,
    tx?: Knex.Transaction,
  ): Promise<OrderTypeEntity> {
    const created = await OrderTypeModel.query(tx).insert(
      fromOrderTypeEntityPatch(orderType),
    );
    return toOrderTypeEntity(created);
  }
  async findById(id: string, tx?: Knex.Transaction) {
    const found = await OrderTypeModel.query(tx).findById(id);
    return found ? toOrderTypeEntity(found) : null;
  }
  async update(id: string, patch: Partial<OrderTypeEntity>, tx?: Knex.Transaction) {
    const updated = await OrderTypeModel.query(tx).patchAndFetchById(
      id,
      fromOrderTypeEntityPatch(patch),
    );
    return updated ? toOrderTypeEntity(updated) : null;
  }
  async remove(id: string, tx?: Knex.Transaction) {
    await OrderTypeModel.query(tx).deleteById(id);
  }
  async page(page: number, limit: number, tx?: Knex.Transaction) {
    const { results, total }: Page<OrderTypeModel> = await OrderTypeModel.query(
      tx,
    ).page(Math.max(0, page - 1), limit);
    return { data: results.map(toOrderTypeEntity), total };
  }
}
