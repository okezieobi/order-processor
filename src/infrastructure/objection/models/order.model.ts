import { BaseModel } from './base.model';
import { RelationMappings } from 'objection';
import { CalculatedOrder } from './calculated_order.model';
import { OrderLog } from './order_log.model';
import { OrderType } from './order_type.model';
import { User } from './user.model';

export class Order extends BaseModel {
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
  order_total_amount_history?: any[];

  static readonly relationMappings: RelationMappings = {
    calculated_order: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: CalculatedOrder,
      join: { from: 'orders.calculated_order_id', to: 'calculated_orders.id' },
    },
    order_type: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: OrderType,
      join: { from: 'orders.order_type_id', to: 'order_types.id' },
    },
    logs: {
      relation: BaseModel.HasManyRelation,
      modelClass: OrderLog,
      join: { from: 'orders.id', to: 'order_logs.order_id' },
    },
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'orders.user_id',
        to: 'users.id',
      },
    },
  };
}
