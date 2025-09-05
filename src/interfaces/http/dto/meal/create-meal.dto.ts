import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateMealDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  active: boolean;

  @IsUUID()
  @IsOptional()
  brandId?: string;

  @IsNumber()
  amount: number;
}
