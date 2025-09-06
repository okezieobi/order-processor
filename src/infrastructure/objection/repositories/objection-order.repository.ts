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
    const modelPatch = fromOrderEntityPatch(order);
    // Normalize order_total_amount_history to ensure plain JSON objects
    if ((modelPatch as any).order_total_amount_history !== undefined) {
      let hist: any = (modelPatch as any).order_total_amount_history;

      const tryParse = (val: any) => {
        if (val && typeof val === 'object') return val;
        if (typeof val !== 'string') return null;
        // try direct parse
        try {
          return JSON.parse(val);
        } catch {
          // try to unescape common double-encoding
          try {
            const unescaped = val.replace(/\\"/g, '"').replace(/^"/, '').replace(/"$/, '');
            return JSON.parse(unescaped);
          } catch {
            return null;
          }
        }
      };

      if (typeof hist === 'string') {
        const p = tryParse(hist);
        hist = Array.isArray(p) ? p : [];
      }

      if (Array.isArray(hist)) {
        const normalized = [] as any[];
        for (const it of hist) {
          // per-element inspection and coercion
          let obj = it;
          // element inspection
          if (typeof it === 'string') {
            const p = tryParse(it);
            if (p) {
              obj = p;
            } else {
              obj = { time: '', total_amount: 0 };
            }
          }
          // ensure keys
          if (obj && obj.totalAmount !== undefined && obj.total_amount === undefined) {
            obj = { time: obj.time, total_amount: Number(obj.totalAmount) };
          }
          if (obj && obj.total_amount !== undefined) {
            normalized.push({ time: String(obj.time), total_amount: Number(obj.total_amount) });
          } else {
            normalized.push({ time: String((obj && obj.time) || ''), total_amount: Number((obj && (obj.total_amount ?? obj.totalAmount)) || 0) });
          }
        }
        (modelPatch as any).order_total_amount_history = normalized;
        // Ensure we pass a JSONB literal to PG to avoid double-encoding issues
        try {
          (modelPatch as any).order_total_amount_history = OrderModel.knex().raw('?::jsonb', [JSON.stringify(normalized)]);
        } catch (e) {
          // if knex/raw fails for any reason, leave the normalized array
        }
      } else {
        (modelPatch as any).order_total_amount_history = [];
      }
    }
    const created = await OrderModel.query(tx).insert(modelPatch);
    return toOrderEntity(created);
  }
  async findById(id: string, tx?: Knex.Transaction) {
    const found = await OrderModel.query(tx).findById(id);
    return found ? toOrderEntity(found) : null;
  }
  async update(id: string, patch: Partial<OrderEntity>, tx?: Knex.Transaction) {
    const modelPatch = fromOrderEntityPatch(patch);
    if ((modelPatch as any).order_total_amount_history !== undefined) {
      let hist: any = (modelPatch as any).order_total_amount_history;

      const tryParse = (val: any) => {
        if (val && typeof val === 'object') return val;
        if (typeof val !== 'string') return null;
        try {
          return JSON.parse(val);
        } catch {
          try {
            const unescaped = val.replace(/\\"/g, '"').replace(/^"/, '').replace(/"$/, '');
            return JSON.parse(unescaped);
          } catch {
            return null;
          }
        }
      };

      if (typeof hist === 'string') {
        const p = tryParse(hist);
        hist = Array.isArray(p) ? p : [];
      }

      if (Array.isArray(hist)) {
        const normalized: any[] = [];
        for (const it of hist) {
          // per-element inspection and coercion
          let obj = it;
          // element inspection
          if (typeof it === 'string') {
            const p = tryParse(it);
            if (p) {
              obj = p;
            } else {
              obj = { time: '', total_amount: 0 };
            }
          }
          if (obj && obj.totalAmount !== undefined && obj.total_amount === undefined) {
            obj = { time: obj.time, total_amount: Number(obj.totalAmount) };
          }
          if (obj && obj.total_amount !== undefined) {
            normalized.push({ time: String(obj.time), total_amount: Number(obj.total_amount) });
          } else {
            normalized.push({ time: String((obj && obj.time) || ''), total_amount: Number((obj && (obj.total_amount ?? obj.totalAmount)) || 0) });
          }
        }
        (modelPatch as any).order_total_amount_history = normalized;
        // Ensure we pass a JSONB literal to PG to avoid double-encoding issues
        try {
          (modelPatch as any).order_total_amount_history = OrderModel.knex().raw('?::jsonb', [JSON.stringify(normalized)]);
        } catch (e) {
          // ignore
        }
      } else {
        (modelPatch as any).order_total_amount_history = [];
      }
    }
    // Temporary debug: print order_total_amount_history payload to diagnose PG json errors
  // no-op: modelPatch.order_total_amount_history normalized above
  const updated = await OrderModel.query(tx).patchAndFetchById(id, modelPatch as any);
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
