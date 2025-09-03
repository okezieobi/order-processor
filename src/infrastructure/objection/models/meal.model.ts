import { BaseModel } from './base.model';
export class MealModel extends BaseModel {
  static readonly tableName = 'meals';
  name!: string;
  amount!: number;
  brand_id?: string;
  active?: boolean;
}
