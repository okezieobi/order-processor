// src/modules/order.module.ts
import { Module } from '@nestjs/common';
import { OrderController } from '../interfaces/http/controllers/order.controller';
import { OrderService } from '../application/services/order.service';
import { OrderRepository } from '../domain/repositories/order.repository';
import { ObjectionOrderRepository } from '../infrastructure/objection/repositories/objection-order.repository';
import { CalculatedOrderPricingPort } from '../domain/ports/calculated-order-pricing.port';
import { ObjectionCalculatedOrderPricing } from '../infrastructure/objection/repositories/objection-calculated-order-pricing.repositories';
import { UnitOfWork } from '../domain/ports/unit-of-work.port';
import { ObjectionUnitOfWork } from '../infrastructure/objection/unit-of-work/objection-uow';
import { OrderEvents } from '../domain/ports/order-events.port';
import { OrderGateway } from '../infrastructure/events/order-events.gateway';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    { provide: OrderRepository, useClass: ObjectionOrderRepository },
    {
      provide: CalculatedOrderPricingPort,
      useClass: ObjectionCalculatedOrderPricing,
    },
    { provide: UnitOfWork, useClass: ObjectionUnitOfWork },
    { provide: OrderEvents, useClass: OrderGateway },
  ],
})
export class OrderModule {}
