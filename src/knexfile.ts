import knex from 'knex';

export const knexConfig = knex({
  client: 'pg', // or mysql, sqlite3
  connection: {
    host: 'localhost',
    user: 'your_user',
    password: 'your_password',
    database: 'your_db',
  },
});
