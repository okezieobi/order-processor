import { BaseModel } from './base.model';
import { RelationMappings } from 'objection';
import { CalculatedOrderModel } from './calculated_order.model';
import { OrderLogModel } from './order_log.model';
import { OrderTypeModel } from './order_type.model';
import { UserModel } from './user.model';

export class OrderModel extends BaseModel {
  static readonly tableName = 'orders';
  user_id!: string;
  order_code?: string;
  calculated_order_id?: string;
  order_type_id?: string;
  completed!: boolean;
  cancelled!: boolean;
  kitchen_cancelled!: boolean;
  kitchen_accepted!: boolean;
  kitchen_prepared!: boolean;
  kitchen_dispatched!: boolean;
  rider_assigned!: boolean;
  paid!: boolean;
  kitchen_dispatched_time?: string;
  kitchen_completed_time?: string;
  kitchen_verified_time?: string;
  completed_time?: string;
  order_total_amount_history!: { time: string; total_amount: number }[];

  static readonly relationMappings: RelationMappings = {
    calculated_order: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: CalculatedOrderModel,
      join: { from: 'orders.calculated_order_id', to: 'calculated_orders.id' },
    },
    order_type: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: OrderTypeModel,
      join: { from: 'orders.order_type_id', to: 'order_types.id' },
    },
    logs: {
      relation: BaseModel.HasManyRelation,
      modelClass: OrderLogModel,
      join: { from: 'orders.id', to: 'order_logs.order_id' },
    },
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: 'orders.user_id',
        to: 'users.id',
      },
    },
  };
}
