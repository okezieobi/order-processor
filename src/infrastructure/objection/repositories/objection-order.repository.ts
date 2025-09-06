// src/infrastructure/objection/repositories/objection-order.repository.ts
import { OrderRepository } from '../../../domain/repositories/order.repository';
import type { OrderEntity } from '../../../domain/entities/order.entity';
import { OrderModel } from '../models/order.model';
import { OrderLogModel } from '../models/order-log.model';
import { toOrderEntity, fromOrderEntityPatch } from '../mappers/order.mapper';
import { normalizeOrderTotalAmountHistory } from '../utils/order-history-normalizer';
import { Knex } from 'knex';

export class ObjectionOrderRepository implements OrderRepository {
  async create(
    order: Partial<OrderEntity>,
    tx?: Knex.Transaction,
  ): Promise<OrderEntity> {
    const modelPatch = fromOrderEntityPatch(order);
    // Normalize order_total_amount_history to ensure plain JSON objects
    const mp = modelPatch as Record<string, unknown>;
    if (Object.hasOwn(mp, 'order_total_amount_history')) {
      const rawValue = mp['order_total_amount_history'];
      const normalized = normalizeOrderTotalAmountHistory(rawValue);
      mp['order_total_amount_history'] = normalized as unknown;
      // Ensure we pass a JSONB literal to PG to avoid double-encoding issues
      try {
        mp['order_total_amount_history'] = OrderModel.knex().raw('?::jsonb', [
          JSON.stringify(normalized),
        ]) as unknown;
      } catch {
        // if knex/raw fails for any reason, leave the normalized array
      }
    }
    const partial: Partial<typeof OrderModel.prototype> =
      modelPatch as unknown as Partial<typeof OrderModel.prototype>;
    const created = await OrderModel.query(tx).insert(partial);
    return toOrderEntity(created);
  }
  async findById(id: string, tx?: Knex.Transaction) {
    const found = await OrderModel.query(tx).findById(id);
    return found ? toOrderEntity(found) : null;
  }
  async update(id: string, patch: Partial<OrderEntity>, tx?: Knex.Transaction) {
    const modelPatch = fromOrderEntityPatch(patch);
    const mp = modelPatch as Record<string, unknown>;
    if (Object.hasOwn(mp, 'order_total_amount_history')) {
      const rawValue = mp['order_total_amount_history'];
      const normalized = normalizeOrderTotalAmountHistory(rawValue);
      mp['order_total_amount_history'] = normalized as unknown;
      try {
        mp['order_total_amount_history'] = OrderModel.knex().raw('?::jsonb', [
          JSON.stringify(normalized),
        ]) as unknown;
      } catch {
        // ignore
      }
    }
    // Temporary debug: print order_total_amount_history payload to diagnose PG json errors
    // no-op: modelPatch.order_total_amount_history normalized above
    const partialPatch: Partial<typeof OrderModel.prototype> =
      modelPatch as unknown as Partial<typeof OrderModel.prototype>;
    const updated = await OrderModel.query(tx).patchAndFetchById(
      id,
      partialPatch,
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
