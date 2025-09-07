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
import { OrderTypeService } from '../../../application/services/order-type.service';
import { Roles } from '../../../common/auth/roles.decorator';
import { CreateOrderTypeDto } from '../dto/order-type/create-order-type.dto';
import { UpdateOrderTypeDto } from '../dto/order-type/update-order-type.dto';

@Controller('order-types')
export class OrderTypeController {
  constructor(private readonly service: OrderTypeService) {}

  @Post()
  @Roles('admins')
  @ApiBody({
    type: CreateOrderTypeDto,
    examples: {
      a: { summary: 'Create order type', value: { name: 'Delivery' } },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The order type has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() data: CreateOrderTypeDto) {
    return this.service.create(data);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The found order type record' })
  @ApiResponse({ status: 404, description: 'Order type not found.' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles('admins')
  @ApiBody({
    type: UpdateOrderTypeDto,
    examples: {
      a: { summary: 'Update order type', value: { name: 'Pickup' } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The order type has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  update(@Param('id') id: string, @Body() data: UpdateOrderTypeDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Roles('admins')
  @ApiResponse({
    status: 200,
    description: 'The order type has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'A list of order types.' })
  list(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.service.list(Number(page), Number(limit));
  }
}
