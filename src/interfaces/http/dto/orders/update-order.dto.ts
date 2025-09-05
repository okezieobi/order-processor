import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  orderCode?: string;

  @IsOptional()
  @IsUUID()
  calculatedOrderId?: string;

  @IsOptional()
  @IsUUID()
  orderTypeId?: string;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;
}
