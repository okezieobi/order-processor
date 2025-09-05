
import { Module } from '@nestjs/common';
import { OrderTypeController } from '../interfaces/http/controllers/order-type.controller';
import { OrderTypeService } from '../application/services/order-type.service';
import { OrderTypeRepository } from '../domain/repositories/order-type.repository';
import { ObjectionOrderTypeRepository } from '../infrastructure/objection/repositories/objection-order-type.repository';

@Module({
  controllers: [OrderTypeController],
  providers: [
    OrderTypeService,
    { provide: OrderTypeRepository, useClass: ObjectionOrderTypeRepository },
  ],
})
export class OrderTypeModule {}
