import { BaseModel } from './base.model';
import { RelationMappings } from 'objection';
export class CalculatedOrderMeal extends BaseModel {
  static readonly tableName = 'calculated_order_meals';
  calculated_order_id!: string;
  meal_id!: string;
  quantity!: number;
  amount!: number;
  static readonly relationMappings: RelationMappings = {
    addons: {
      relation: BaseModel.HasManyRelation,
      modelClass: __dirname + '/calculated_order_meal_addon.model',
      join: {
        from: 'calculated_order_meals.id',
        to: 'calculated_order_meal_addons.calculated_order_meal_id',
      },
    },
  };
}
