// src/infrastructure/objection/repositories/objection_meal.repository.ts
import { MealRepository } from '../../../domain/repositories/meal.repository';
import type { MealEntity } from '../../../domain/entities/meal.entity';
import { MealModel } from '../models/meal.model';
import { toMealEntity, fromMealEntityPatch } from '../mappers/meal.mapper';
import { Knex } from 'knex';
import { Page } from 'objection';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectionMealRepository extends MealRepository {
  async create(
    meal: Partial<MealEntity>,
    tx?: Knex.Transaction,
  ): Promise<MealEntity> {
    const created = await MealModel.query(tx).insert(
      fromMealEntityPatch(meal),
    );
    return toMealEntity(created);
  }
  async findById(id: string, tx?: Knex.Transaction) {
    const found = await MealModel.query(tx).findById(id);
    return found ? toMealEntity(found) : null;
  }
  async update(id: string, patch: Partial<MealEntity>, tx?: Knex.Transaction) {
    const updated = await MealModel.query(tx).patchAndFetchById(
      id,
      fromMealEntityPatch(patch),
    );
    return updated ? toMealEntity(updated) : null;
  }
  async remove(id: string, tx?: Knex.Transaction) {
    await MealModel.query(tx).deleteById(id);
  }
  async page(page: number, limit: number, tx?: Knex.Transaction) {
    const { results, total }: Page<MealModel> = await MealModel.query(tx).page(
      Math.max(0, page - 1),
      limit,
    );
    return { data: results.map(toMealEntity), total };
  }
}
