import { OrderLogEntity } from '../entities/order_log.entity';
import { BaseRepository } from './base.repository';

export abstract class OrderLogRepository extends BaseRepository<OrderLogEntity> {}
