// Update with your config settings.

const env = require('dotenv').config();

module.exports = {
  client: 'pg',
  connection: {
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT
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
