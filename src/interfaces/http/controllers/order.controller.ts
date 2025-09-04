// src/interfaces/http/controllers/order.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, Query, UsePipes } from '@nestjs/common';
import { OrderService } from '../../../application/services/order.service';
import { JoiValidationPipe } from '../../../common/pipes/joi-validation.pipe';
import { createOrderSchema } from '../dto/orders/joi-schemas';
import { CreateOrderDto } from '../dto/orders/create-order.dto';
import { UpdateOrderDto } from '../dto/orders/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createOrderSchema))
  create(@Body() dto: CreateOrderDto) { return this.service.create(dto); }

  @Get(':id')
  findById(@Param('id') id: string) { return this.service.findById(id); }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDto) { return this.service.update(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }

  @Get()
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }

  @Post(':id/process')
  process(@Param('id') id: string, @Query('action') action: 'accept'|'prepare'|'dispatch'|'complete'|'cancel') {
    return this.service.processOrder(id, action);
  }
}
