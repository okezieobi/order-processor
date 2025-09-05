// src/infrastructure/objection/repositories/objection-order.repository.ts
import { OrderRepository } from '../../../domain/repositories/order.repository';
import type { OrderEntity } from '../../../domain/entities/order.entity';
import { OrderModel } from '../models/order.model';
import { OrderLogModel } from '../models/order-log.model';
import { toOrderEntity, fromOrderEntityPatch } from '../mappers/order.mapper';
import { Knex } from 'knex';

export class ObjectionOrderRepository implements OrderRepository {
  async create(
    order: Partial<OrderEntity>,
    tx?: Knex.Transaction,
  ): Promise<OrderEntity> {
    const created = await OrderModel.query(tx).insert(
      fromOrderEntityPatch(order),
    );
    return toOrderEntity(created);
  }
  async findById(id: string, tx?: Knex.Transaction) {
    const found = await OrderModel.query(tx).findById(id);
    return found ? toOrderEntity(found) : null;
  }
  async update(id: string, patch: Partial<OrderEntity>, tx?: Knex.Transaction) {
    const updated = await OrderModel.query(tx).patchAndFetchById(
      id,
      fromOrderEntityPatch(patch),
    );
    return updated ? toOrderEntity(updated) : null;
  }
  async remove(id: string, tx?: Knex.Transaction) {
    await OrderModel.query(tx).deleteById(id);
  }
  async page(page: number, limit: number, tx?: Knex.Transaction) {
    const { results, total } = await OrderModel.query(tx).page(
      Math.max(0, page - 1),
      limit,
    );
    return { data: results.map(toOrderEntity), total };
  }
  async addLog(
    orderId: string,
    description: string,
    time: string,
    tx?: Knex.Transaction,
  ) {
    await OrderLogModel.query(tx).insert({
      order_id: orderId,
      description,
      time,
    });
  }
}
