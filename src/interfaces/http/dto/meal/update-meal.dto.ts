import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class UpdateMealDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsUUID()
  @IsOptional()
  brandId?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;
}
