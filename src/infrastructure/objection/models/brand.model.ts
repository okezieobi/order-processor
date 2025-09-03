import { BaseModel } from './base.model';
export class BrandModel extends BaseModel {
  static readonly tableName = 'brands';
  name!: string;
}
