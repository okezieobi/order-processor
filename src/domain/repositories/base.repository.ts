export abstract class BaseRepository<T> {
  abstract create(order: Partial<T>, tx?: unknown): Promise<T>;
  abstract findById(id: string, tx?: unknown): Promise<T | null>;
  abstract update(
    id: string,
    patch: Partial<T>,
    tx?: unknown,
  ): Promise<T | null>;
  abstract remove(id: string, tx?: unknown): Promise<void>;
  abstract page(
    page: number,
    limit: number,
    tx?: unknown,
  ): Promise<{ data: T[]; total: number }>;
}
