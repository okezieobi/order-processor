import { BaseModel } from './base.model';
import { RelationMappings, Model } from 'objection';

export class CalculatedOrderModel extends BaseModel {
  static readonly tableName = 'calculated_orders';

  total_amount!: number;
  delivery_fee!: number;
  service_charge!: number;
  free_delivery!: boolean;
  address_details!: Record<string, any>;
  lat?: string;
  lng?: string;
  pickup!: boolean;

  static readonly jsonSchema = {
    type: 'object',
    properties: {
      address_details: { type: 'object' },
    },
  };

  static readonly relationMappings: RelationMappings = {
    items: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + '/calculated_order_meal.model',
      join: {
        from: 'calculated_orders.id',
        to: 'calculated_order_meals.calculated_order_id',
      },
    },
  };
}
