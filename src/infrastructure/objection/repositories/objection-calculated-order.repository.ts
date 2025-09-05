
import { CalculatedOrderRepository } from '../../../domain/repositories/calculated-order.repository';
import type { CalculatedOrderEntity } from '../../../domain/entities/calculated-order.entity';
import { CalculatedOrderModel } from '../models/calculated-order.model';
import { toCalculatedOrderEntity, fromCalculatedOrderEntityPatch } from '../mappers/calculated-order.mapper';
import { Knex } from 'knex';
import { Page } from 'objection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectionCalculatedOrderRepository extends CalculatedOrderRepository {
  async create(
    calculatedOrder: Partial<CalculatedOrderEntity>,
    tx?: Knex.Transaction,
  ): Promise<CalculatedOrderEntity> {
    const created = await CalculatedOrderModel.query(tx).insert(
      fromCalculatedOrderEntityPatch(calculatedOrder),
    );
    return toCalculatedOrderEntity(created);
  }
  async findById(id: string, tx?: Knex.Transaction) {
    const found = await CalculatedOrderModel.query(tx).findById(id);
    return found ? toCalculatedOrderEntity(found) : null;
  }
  async update(id: string, patch: Partial<CalculatedOrderEntity>, tx?: Knex.Transaction) {
    const updated = await CalculatedOrderModel.query(tx).patchAndFetchById(
      id,
      fromCalculatedOrderEntityPatch(patch),
    );
    return updated ? toCalculatedOrderEntity(updated) : null;
  }
  async remove(id: string, tx?: Knex.Transaction) {
    await CalculatedOrderModel.query(tx).deleteById(id);
  }
  async page(page: number, limit: number, tx?: Knex.Transaction) {
    const { results, total }: Page<CalculatedOrderModel> = await CalculatedOrderModel.query(
      tx,
    ).page(Math.max(0, page - 1), limit);
    return { data: results.map(toCalculatedOrderEntity), total };
  }
}
