import { BaseModel } from './base.model';
export class Brand extends BaseModel {
  static readonly tableName = 'brands';
  name!: string;
}
