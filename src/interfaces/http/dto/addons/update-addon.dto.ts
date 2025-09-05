
import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';

export class UpdateAddonDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsUUID()
  @IsOptional()
  brandId?: string;
}
