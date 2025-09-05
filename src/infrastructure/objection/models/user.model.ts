import { BaseModel } from './base.model';
import { RelationMappings } from 'objection';
import { OrderModel } from './order.model';

export class UserModel extends BaseModel {
  static readonly tableName = 'users';

  first_name!: string;
  last_name!: string;
  email!: string;
  phone?: string;
  password_hash!: string;
  is_active!: boolean;
  roles!: string[];

  static readonly relationMappings: RelationMappings = {
    orders: {
      relation: BaseModel.HasManyRelation,
      modelClass: OrderModel,
      join: {
        from: 'users.id',
        to: 'orders.user_id',
      },
    },
  };
}
