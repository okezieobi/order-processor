// src/application/services/brand.service.ts
import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';

import { OrderTypeEntity } from '../../domain/entities/order-type.entity';
import { OrderTypeRepository } from '../../domain/repositories/order-type.repository';

@Injectable()
export class OrderTypeService extends BaseService<OrderTypeEntity> {
  constructor(repo: OrderTypeRepository) {
    super(repo);
  }
}
