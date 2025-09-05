import {
  IsNumber,
  IsBoolean,
  IsObject,
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateCalculatedOrderDto {
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsBoolean()
  @IsOptional()
  freeDelivery?: boolean;

  @IsNumber()
  @IsOptional()
  deliveryFee?: number;

  @IsNumber()
  @IsOptional()
  serviceCharge?: number;

  @IsObject()
  @IsOptional()
  addressDetails?: Record<string, any>;

  @IsString()
  @IsOptional()
  lat?: string;

  @IsString()
  @IsOptional()
  lng?: string;

  @IsBoolean()
  @IsOptional()
  pickup?: boolean;
}
