
import { IsString, IsOptional } from 'class-validator';

export class UpdateOrderTypeDto {
  @IsString()
  @IsOptional()
  name?: string;
}
