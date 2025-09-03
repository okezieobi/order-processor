import { Model } from 'objection';

export class BaseModel extends Model {
  id!: string;
  created_at?: string;
  updated_at?: string;

  $beforeInsert() {
    const now = new Date().toISOString();
    this.created_at = now;
    this.updated_at = now;
  }
  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}
