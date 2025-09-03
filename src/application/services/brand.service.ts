// src/application/services/brand.service.ts
import { Injectable } from '@nestjs/common';
import { BrandRepository } from '../../domain/repositories/brand.repository';
import type { BrandEntity } from '../../domain/entities/brand.entity';

@Injectable()
export class BrandService {
  constructor(private readonly repo: BrandRepository) {}
  create(data: Omit<BrandEntity, 'id'>) {
    return this.repo.create(data);
  }
  findById(id: string) {
    return this.repo.findById(id);
  }
  update(id: string, patch: Partial<BrandEntity>) {
    return this.repo.update(id, patch);
  }
  remove(id: string) {
    return this.repo.remove(id);
  }
  list(page: number, limit: number) {
    return this.repo.page(page, limit);
  }
}
