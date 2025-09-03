import knex, { Knex } from 'knex';

export const knexConfig: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'order_processor',
  },
  pool: { min: 2, max: 10 },
  migrations: { tableName: 'knex_migrations' },
};
export const createKnex = () => knex(knexConfig);
