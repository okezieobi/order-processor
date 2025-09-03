import { BaseModel } from './base.model';
export class Meal extends BaseModel {
  static readonly tableName = 'meals';
  name!: string;
  amount!: number;
  brand_id?: string;
}
