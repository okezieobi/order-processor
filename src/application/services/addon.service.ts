// src/application/services/brand.service.ts
import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { AddonEntity } from '../../domain/entities/addon.entity';
import { AddonRepository } from '../../domain/repositories/addon.reposItory';

@Injectable()
export class AddonService extends BaseService<AddonEntity> {
  constructor(repo: AddonRepository) {
    super(repo);
  }
}
