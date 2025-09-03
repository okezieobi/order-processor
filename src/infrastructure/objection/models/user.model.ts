import { BaseModel } from './base.model';
import { RelationMappings } from 'objection';
import { Order } from './order.model';

export class User extends BaseModel {
  static readonly tableName = 'users';

  first_name!: string;
  last_name!: string;
  email!: string;
  phone?: string;
  password_hash!: string;
  is_active!: boolean;

  static readonly relationMappings: RelationMappings = {
    orders: {
      relation: BaseModel.HasManyRelation,
      modelClass: Order,
      join: {
        from: 'users.id',
        to: 'orders.user_id',
      },
    },
  };
}
