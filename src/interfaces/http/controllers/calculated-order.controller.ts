
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
import { CalculatedOrderService } from '../../../application/services/calcuated-order.service';
import { CreateCalculatedOrderDto } from '../dto/calculated-order/create-calculated-order.dto';
import { UpdateCalculatedOrderDto } from '../dto/calculated-order/update-calculated-order.dto';

@Controller('calculated-orders')
export class CalculatedOrderController {
  constructor(private readonly service: CalculatedOrderService) {}

  @Post()
  create(@Body() data: CreateCalculatedOrderDto) {
    return this.service.create(data);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateCalculatedOrderDto) {
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
