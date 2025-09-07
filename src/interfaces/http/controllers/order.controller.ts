import { ApiBody, ApiResponse } from '@nestjs/swagger';
// src/interfaces/http/controllers/order.controller.ts
import {
  Controller,
  Get,
  Post,
  HttpCode,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UsePipes,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { OrderService } from '../../../application/services/order.service';
import { Roles } from '../../../common/auth/roles.decorator';
import { JoiValidationPipe } from '../../../common/pipes/joi-validation.pipe';
import { createOrderSchema } from '../dto/orders/joi-schema';
import { CreateOrderDto } from '../dto/orders/create-order.dto';
import { UpdateOrderDto } from '../dto/orders/update-order.dto';
import { OrderOwnershipGuard } from '../../../common/auth/order-ownership.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @Roles('users', 'admins')
  @UsePipes(new JoiValidationPipe(createOrderSchema))
  @ApiBody({
    type: CreateOrderDto,
    examples: {
      a: {
        summary: 'Create order',
        value: {
          userId: 'an_user_id',
          orderCode: 'an_order_code',
          calculatedOrderId: 'a_calc_order_id',
          orderTypeId: 'an_order_type_id',
          paid: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  @UseGuards(OrderOwnershipGuard)
  @ApiResponse({ status: 200, description: 'The found order record' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findById(@Req() req: Request) {
    return req.order;
  }

  @Put(':id')
  @UseGuards(OrderOwnershipGuard)
  @ApiBody({
    type: UpdateOrderDto,
    examples: { a: { summary: 'Update order', value: { paid: true } } },
  })
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(OrderOwnershipGuard)
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get()
  @Roles('admins')
  @ApiResponse({ status: 200, description: 'A list of orders.' })
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }

  @Post(':id/process')
  @UseGuards(OrderOwnershipGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The order has been successfully processed.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async process(
    @Param('id') id: string,
    @Query('action')
    action: 'accept' | 'prepare' | 'dispatch' | 'complete' | 'cancel',
  ) {
    return this.service.processOrder(id, action);
  }
}
