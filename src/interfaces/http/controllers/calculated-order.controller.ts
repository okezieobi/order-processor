import { ApiBody, ApiResponse } from '@nestjs/swagger';
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
import { CalculatedOrderService } from '../../../application/services/calculated-order.service';
import { Roles } from '../../../common/auth/roles.decorator';
import { CreateCalculatedOrderDto } from '../dto/calculated-order/create-calculated-order.dto';
import { UpdateCalculatedOrderDto } from '../dto/calculated-order/update-calculated-order.dto';

@Controller('calculated-orders')
export class CalculatedOrderController {
  constructor(private readonly service: CalculatedOrderService) {}

  @Post()
  @Roles('users', 'admins')
  @ApiBody({
    type: CreateCalculatedOrderDto,
    examples: {
      a: {
        summary: 'Create calculated order',
        value: {
          totalAmount: 100,
          freeDelivery: false,
          deliveryFee: 10,
          serviceCharge: 5,
          addressDetails: {},
          lat: '123',
          lng: '456',
          pickup: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The calculated order has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() data: CreateCalculatedOrderDto) {
    return this.service.create(data);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found calculated order record',
  })
  @ApiResponse({ status: 404, description: 'Calculated order not found.' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('admins')
  @ApiBody({
    type: UpdateCalculatedOrderDto,
    examples: {
      a: { summary: 'Update calculated order', value: { totalAmount: 120 } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The calculated order has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() data: UpdateCalculatedOrderDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Roles('admins')
  @ApiResponse({
    status: 200,
    description: 'The calculated order has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'A list of calculated orders.' })
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }
}
