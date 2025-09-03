import { OrderTypeEntity } from '../entities/order_type.entity';
import { BaseRepository } from './base.repository';

export abstract class OrderTypeRepository extends BaseRepository<OrderTypeEntity> {}
