// src/infrastructure/events/order-events.gateway.ts
import { OrderEvents } from '../../domain/ports/order-events.port';
import type { OrderEntity } from '../../domain/entities/order.entity';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { OnModuleDestroy } from '@nestjs/common';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class OrderGateway extends OrderEvents implements OnModuleDestroy {
  @WebSocketServer() server!: Server;

  // eslint-disable-next-line @typescript-eslint/require-await
  async emitUpdated(order: OrderEntity): Promise<void> {
    this.server.emit('order.updated', order);
  }

  async onModuleDestroy() {
    const s = this.server as
      | (Server & { close?: (() => void) | (() => Promise<void>) })
      | undefined;
    if (!s?.close) return;

    try {
      const maybe = s.close() as unknown;
      if (maybe && typeof (maybe as { then?: unknown }).then === 'function') {
        await (maybe as Promise<void>);
      }
    } catch {
      // ignore any errors during shutdown
    }
  }
}
