// src/application/services/order.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { CalculatedOrderPricingPort } from '../../domain/ports/calculated-order-pricing.port';
import { UnitOfWork } from '../../domain/ports/unit-of-work.port';
import { OrderEvents } from '../../domain/ports/order-events.port';
import type { OrderEntity } from '../../domain/entities/order.entity';

export type OrderAction =
  | 'accept'
  | 'prepare'
  | 'dispatch'
  | 'complete'
  | 'cancel';

@Injectable()
export class OrderService {
  constructor(
    private readonly orders: OrderRepository,
    private readonly pricing: CalculatedOrderPricingPort,
    private readonly uow: UnitOfWork,
    private readonly events: OrderEvents,
  ) {}

  async create(data: Partial<OrderEntity>) {
    return this.orders.create({
      completed: false,
      cancelled: false,
      kitchenCancelled: false,
      kitchenAccepted: false,
      kitchenPrepared: false,
      kitchenDispatched: false,
      riderAssigned: false,
      paid: data.paid ?? false,
      orderTotalAmountHistory: [],
      ...data,
    });
  }

  findById(id: string) {
    return this.orders.findById(id);
  }

  update(id: string, patch: Partial<OrderEntity>) {
    return this.orders.update(id, patch);
  }

  async remove(id: string) {
    await this.orders.remove(id);
    return { deleted: true };
  }

  list(page = 1, limit = 20) {
    return this.orders.page(page, limit);
  }

  async processOrder(orderId: string, action: OrderAction) {
    const updated = await this.uow.run<OrderEntity | null>(async (tx) => {
      const order = await this.orders.findById(orderId, tx);
      if (!order) throw new BadRequestException('Order not found');
      const now = new Date().toISOString();

      this.validateOrderAction(order, action);

      const { patch, logMsg } = this.getOrderPatchAndLog(order, action, now);

      // Re-enable appending to orderTotalAmountHistory safely.
      // Ensure history is an array and append a normalized entry with current total.
      const history = Array.isArray(order.orderTotalAmountHistory)
        ? order.orderTotalAmountHistory.slice()
        : [];
      try {
        // compute current total using pricing port when available
        if (order.calculatedOrderId) {
          const currentTotal = await this.pricing.computeTotal(
            order.calculatedOrderId,
          );
          const entry = { time: now, totalAmount: Number(currentTotal) } as unknown as OrderEntity['orderTotalAmountHistory'][number];
          history.push(entry);
          // attach to patch using domain naming; mapper will convert to model field
          (patch as Partial<OrderEntity>).orderTotalAmountHistory = history as OrderEntity['orderTotalAmountHistory'];
          // attach history (normalized) to patch; repository will handle storage format
        }
      } catch {
        // pricing failed; ignore and continue
      }

      const saved = await this.orders.update(orderId, patch, tx);
      await this.orders.addLog(orderId, logMsg, now, tx);
      return saved;
    });

    if (updated) await this.events.emitUpdated(updated);
    return updated;
  }

  private validateOrderAction(order: OrderEntity, action: OrderAction) {
    if (order.cancelled || order.kitchenCancelled)
      throw new BadRequestException('Order already cancelled');
    if (action === 'prepare' && !order.kitchenAccepted)
      throw new BadRequestException('Must accept before prepare');
    if (action === 'dispatch' && !order.kitchenPrepared)
      throw new BadRequestException('Must prepare before dispatch');
    if (action === 'complete' && !order.kitchenDispatched)
      throw new BadRequestException('Must dispatch before complete');
  }

  private getOrderPatchAndLog(
    order: OrderEntity,
    action: OrderAction,
    now: string,
  ) {
    const patch: Partial<OrderEntity> = {};
    let logMsg = '';

    switch (action) {
      case 'accept':
        if (order.kitchenAccepted)
          throw new BadRequestException('Already accepted');
        patch.kitchenAccepted = true;
        patch.kitchenVerifiedTime = now;
        logMsg = 'Order accepted by kitchen';
        break;
      case 'prepare':
        if (order.kitchenPrepared)
          throw new BadRequestException('Already prepared');
        patch.kitchenPrepared = true;
        patch.kitchenCompletedTime = now;
        logMsg = 'Order completed by kitchen';
        break;
      case 'dispatch':
        if (order.kitchenDispatched)
          throw new BadRequestException('Already dispatched');
        patch.kitchenDispatched = true;
        patch.kitchenDispatchedTime = now;
        logMsg = 'Order dispatched by front desk';
        break;
      case 'complete':
        if (order.completed) throw new BadRequestException('Already completed');
        patch.completed = true;
        patch.completedTime = now;
        logMsg = 'Trip completed by rider';
        break;
      case 'cancel':
        patch.cancelled = true;
        logMsg = 'Order cancelled';
        break;
    }

    return { patch, logMsg };
  }
}
