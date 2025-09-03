import { BaseModel } from './base.model';
export class CalculatedOrderMealAddon extends BaseModel {
  static readonly tableName = 'calculated_order_meal_addons';
  calculated_order_meal_id!: string;
  addon_id!: string;
  quantity!: number;
  amount!: number;
}
