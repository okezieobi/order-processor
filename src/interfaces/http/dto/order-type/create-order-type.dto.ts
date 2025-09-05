import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOrderTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
