import { Model } from 'objection';
import { knexConfig } from './knexfile';

Model.knex(knexConfig);

export { Model };
