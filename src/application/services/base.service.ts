import { BaseEntity } from 'src/domain/entities/base.entity';
import { BaseRepository } from 'src/domain/repositories/base.repository';
import { NotFoundException } from '@nestjs/common';

export class BaseService<E extends BaseEntity> {
  constructor(private readonly repo: BaseRepository<E>) {}
  create(data: Partial<E>) {
    return this.repo.create(data);
  }
  async findById(id: string) {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundException();
    return found;
  }
  update(id: string, patch: Partial<E>) {
    return this.repo.update(id, patch);
  }
  async remove(id: string) {
    await this.repo.remove(id);
    return { deleted: true };
  }
  list(page: number, limit: number) {
    return this.repo.page(page, limit);
  }
}
