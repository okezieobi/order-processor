// src/infrastructure/events/order-events.gateway.ts
import { OrderEvents } from '../../domain/ports/order-events.port';
import type { OrderEntity } from '../../domain/entities/order.entity';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class OrderGateway extends OrderEvents {
  @WebSocketServer() server!: Server;

  // eslint-disable-next-line @typescript-eslint/require-await
  async emitUpdated(order: OrderEntity): Promise<void> {
    this.server.emit('order.updated', order);
  }
}
