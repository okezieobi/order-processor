import { BaseModel } from './base.model';
export class OrderTypeModel extends BaseModel {
  static readonly tableName = 'order_types';
  name!: string;
}
