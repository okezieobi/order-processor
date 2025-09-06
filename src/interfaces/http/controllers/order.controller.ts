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
  NotFoundException,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { OrderService } from '../../../application/services/order.service';
import { Roles } from '../../../common/auth/roles.decorator';
import { JoiValidationPipe } from '../../../common/pipes/joi-validation.pipe';
import { createOrderSchema } from '../dto/orders/joi-schema';
import { CreateOrderDto } from '../dto/orders/create-order.dto';
import { UpdateOrderDto } from '../dto/orders/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @Roles('users', 'admins')
  @UsePipes(new JoiValidationPipe(createOrderSchema))
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    const found = await this.service.findById(id);
    if (!found) throw new NotFoundException('Order not found');
    const maybeUser = req.user as unknown;
    if (!maybeUser) throw new ForbiddenException('Insufficient permissions');
    const user = maybeUser as { id?: string; roles?: unknown };
    if (Array.isArray(user.roles) && user.roles.includes('admins'))
      return found;
    if (user.id !== found.userId)
      throw new ForbiddenException('Insufficient permissions');
    return found;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @Req() req: Request,
  ) {
    const existing = await this.service.findById(id);
    if (!existing) throw new NotFoundException('Order not found');
    const maybeUser = req.user as unknown;
    if (!maybeUser) throw new ForbiddenException('Insufficient permissions');
    const user = maybeUser as { id?: string; roles?: unknown };
    if (!Array.isArray(user.roles) || !user.roles.includes('admins')) {
      if (user.id !== existing.userId)
        throw new ForbiddenException('Insufficient permissions');
    }
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const existing = await this.service.findById(id);
    if (!existing) throw new NotFoundException('Order not found');
    const maybeUser = req.user as unknown;
    if (!maybeUser) throw new ForbiddenException('Insufficient permissions');
    const user = maybeUser as { id?: string; roles?: unknown };
    if (!Array.isArray(user.roles) || !user.roles.includes('admins')) {
      if (user.id !== existing.userId)
        throw new ForbiddenException('Insufficient permissions');
    }
    return this.service.remove(id);
  }

  @Get()
  @Roles('admins')
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }

  @Post(':id/process')
  @HttpCode(200)
  async process(
    @Param('id') id: string,
    @Query('action')
    action: 'accept' | 'prepare' | 'dispatch' | 'complete' | 'cancel',
    @Req() req: Request,
  ) {
    const existing = await this.service.findById(id);
    if (!existing) throw new NotFoundException('Order not found');
    const maybeUser = req.user as unknown;
    if (!maybeUser) throw new ForbiddenException('Insufficient permissions');
    const user = maybeUser as { id?: string; roles?: unknown };
    if (!Array.isArray(user.roles) || !user.roles.includes('admins')) {
      if (user.id !== existing.userId)
        throw new ForbiddenException('Insufficient permissions');
    }
    return this.service.processOrder(id, action);
  }
}
