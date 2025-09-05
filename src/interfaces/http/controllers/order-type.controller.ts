
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { OrderTypeService } from '../../../application/services/order-type.service';
import { CreateOrderTypeDto } from '../dto/order-type/create-order-type.dto';
import { UpdateOrderTypeDto } from '../dto/order-type/update-order-type.dto';

@Controller('order-types')
export class OrderTypeController {
  constructor(private readonly service: OrderTypeService) {}

  @Post()
  create(@Body() data: CreateOrderTypeDto) {
    return this.service.create(data);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateOrderTypeDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get()
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }
}
