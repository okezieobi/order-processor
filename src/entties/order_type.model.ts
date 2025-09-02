import { BaseModel } from './base.model';
export class OrderType extends BaseModel {
  static readonly tableName = 'order_types';
  name!: string;
}
