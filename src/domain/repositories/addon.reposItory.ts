import { AddonEntity } from '../entities/addon.entity';
import { BaseRepository } from './base.repository';

export abstract class AddonRepository extends BaseRepository<AddonEntity> {}
