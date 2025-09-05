import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateAddonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  amount: number;

  @IsUUID()
  @IsOptional()
  brandId?: string;
}
