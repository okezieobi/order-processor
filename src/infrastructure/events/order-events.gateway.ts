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
      const s = this.server as (Server & { close?: Promise<void> | (() => void) }) | undefined;
      if (!s?.close) return;
      // close may return a promise or be synchronous
      // await if it returns a promise
      // eslint-disable-next-line @typescript-eslint/ban-types
      const result = (s.close as unknown) as Promise<void> | Function;
      if (typeof result === 'function') {
        const maybePromise = (result as Function).call(s);
        if (maybePromise && typeof (maybePromise as Promise<void>).then === 'function') {
          await (maybePromise as Promise<void>);
        }
      } else if (result && typeof (result as Promise<void>).then === 'function') {
        await (result as Promise<void>);
      }
  }
}
