// src/domain/ports/order-events.port.ts
import type { OrderEntity } from '../entities/order.entity';
export abstract class OrderEvents {
  abstract emitUpdated(order: OrderEntity): Promise<void>;
}
