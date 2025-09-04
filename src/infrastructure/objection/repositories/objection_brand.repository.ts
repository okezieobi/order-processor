// src/infrastructure/objection/repositories/objection_brand.repository.ts
import { BrandRepository } from '../../../domain/repositories/brand.repository';
import type { BrandEntity } from '../../../domain/entities/brand.entity';
import { BrandModel } from '../models/brand.model';
import { toBrandEntity, fromBrandEntityPatch } from '../mappers/brand.mapper';
import { Knex } from 'knex';
import { Page } from 'objection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectionBrandRepository extends BrandRepository {
  async create(
    brand: Partial<BrandEntity>,
    tx?: Knex.Transaction,
  ): Promise<BrandEntity> {
    const created = await BrandModel.query(tx).insert(
      fromBrandEntityPatch(brand),
    );
    return toBrandEntity(created);
  }
  async findById(id: string, tx?: Knex.Transaction) {
    const found = await BrandModel.query(tx).findById(id);
    return found ? toBrandEntity(found) : null;
  }
  async update(id: string, patch: Partial<BrandEntity>, tx?: Knex.Transaction) {
    const updated = await BrandModel.query(tx).patchAndFetchById(
      id,
      fromBrandEntityPatch(patch),
    );
    return updated ? toBrandEntity(updated) : null;
  }
  async remove(id: string, tx?: Knex.Transaction) {
    await BrandModel.query(tx).deleteById(id);
  }
  async page(page: number, limit: number, tx?: Knex.Transaction) {
    const { results, total }: Page<BrandModel> = await BrandModel.query(tx).page(
      Math.max(0, page - 1),
      limit,
    );
    return { data: results.map(toBrandEntity), total };
  }
}
