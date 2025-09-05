import { OrderLogEntity } from '../entities/order-log.entity';
import { BaseRepository } from './base.repository';

export abstract class OrderLogRepository extends BaseRepository<OrderLogEntity> {}
