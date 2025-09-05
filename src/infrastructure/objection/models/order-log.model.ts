import { BaseModel } from './base.model';
export class OrderLogModel extends BaseModel {
  static readonly tableName = 'order_logs';
  order_id!: string;
  time!: string;
  description!: string;
}
