// Update with your config settings.

require('dotenv').config();

module.exports = {
  client: 'postgresql',
  connection: {
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    schemaName: 'wm_backend',
    tableName: 'knex_migrations'
  }
};
