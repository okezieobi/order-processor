import { BaseModel } from './base.model';
export class AddonModel extends BaseModel {
  static readonly tableName = 'addons';
  name!: string;
  amount!: number;
  brand_id?: string;
}
