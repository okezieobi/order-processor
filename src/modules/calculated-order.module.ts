
import { Module } from '@nestjs/common';
import { CalculatedOrderController } from '../interfaces/http/controllers/calculated-order.controller';
import { CalculatedOrderService } from '../application/services/calculated-order.service';
import { CalculatedOrderRepository } from '../domain/repositories/calculated-order.repository';
import { ObjectionCalculatedOrderRepository } from '../infrastructure/objection/repositories/objection-calculated-order.repository';

@Module({
  controllers: [CalculatedOrderController],
  providers: [
    CalculatedOrderService,
    { provide: CalculatedOrderRepository, useClass: ObjectionCalculatedOrderRepository },
  ],
})
export class CalculatedOrderModule {}
