// src/application/services/brand.service.ts
import { Injectable } from '@nestjs/common';
import { BrandRepository } from '../../domain/repositories/brand.repository';
import type { BrandEntity } from '../../domain/entities/brand.entity';
import { BaseService } from './base.service';

@Injectable()
export class BrandService extends BaseService<BrandEntity> {
  constructor(repo: BrandRepository) {
    super(repo);
  }
}
