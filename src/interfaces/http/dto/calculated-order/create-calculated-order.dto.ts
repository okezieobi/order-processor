
import { IsNumber, IsBoolean, IsObject, IsString, IsOptional } from 'class-validator';

export class CreateCalculatedOrderDto {
  @IsNumber()
  totalAmount: number;

  @IsBoolean()
  freeDelivery: boolean;

  @IsNumber()
  deliveryFee: number;

  @IsNumber()
  serviceCharge: number;

  @IsObject()
  addressDetails: Record<string, any>;

  @IsString()
  @IsOptional()
  lat?: string;

  @IsString()
  @IsOptional()
  lng?: string;

  @IsBoolean()
  pickup: boolean;
}
