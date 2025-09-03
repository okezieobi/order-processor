// src/application/services/brand.service.ts
import { Injectable } from '@nestjs/common';

import { BaseService } from './base.service';
import { CalculatedOrderEntity } from '../../domain/entities/calculated_order.entity';
import { CalculatedOrderRepository } from '../../domain/repositories/calculated_order.repository';

@Injectable()
export class CalculatedOrderService extends BaseService<CalculatedOrderEntity> {
  constructor(repo: CalculatedOrderRepository) {
    super(repo);
  }
}
