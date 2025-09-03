import { BaseEntity } from 'src/domain/entities/base.entity';
import { BaseRepository } from 'src/domain/repositories/base.repository';

export class BaseService<E extends BaseEntity> {
  constructor(private readonly repo: BaseRepository<E>) {}
  create(data: Partial<E>) {
    return this.repo.create(data);
  }
  findById(id: string) {
    return this.repo.findById(id);
  }
  update(id: string, patch: Partial<E>) {
    return this.repo.update(id, patch);
  }
  remove(id: string) {
    return this.repo.remove(id);
  }
  list(page: number, limit: number) {
    return this.repo.page(page, limit);
  }
}
