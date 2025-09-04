// src/interfaces/http/dto/orders/create-order.dto.ts
import { IsUUID, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateOrderDto {
  @IsUUID() userId!: string;
  @IsOptional() @IsString() orderCode?: string;
  @IsOptional() @IsUUID() calculatedOrderId?: string;
  @IsOptional() @IsUUID() orderTypeId?: string;
  @IsOptional() @IsBoolean() paid?: boolean;
}
