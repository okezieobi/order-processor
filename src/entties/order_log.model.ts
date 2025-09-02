import { BaseModel } from './base.model';
export class OrderLog extends BaseModel {
  static readonly tableName = 'order_logs';
  order_id!: string;
  time!: string;
  description!: string;
}
