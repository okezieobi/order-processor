import { BrandEntity } from '../entities/brand.entity';
import { BaseRepository } from './base.repository';

export abstract class BrandRepository extends BaseRepository<BrandEntity> {}
