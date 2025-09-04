// src/interfaces/http/dto/orders/update-order.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create_order.dto';
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
