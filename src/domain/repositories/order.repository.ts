// src/domain/repositories/order.repository.ts
import { OrderEntity } from '../entities/order.entity';
import { BaseRepository } from './base.repository';

export abstract class OrderRepository extends BaseRepository<OrderEntity> {
  abstract addLog(
    orderId: string,
    description: string,
    time: string,
    tx?: unknown,
  ): Promise<void>;
}
