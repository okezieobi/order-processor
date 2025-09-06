import { UserEntity } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

export abstract class UserRepository extends BaseRepository<UserEntity> {
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findById(id: string): Promise<UserEntity | null>;
}
