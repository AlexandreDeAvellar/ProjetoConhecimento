const Knex = require('knex');
const knexfile = require('../knexfile.js');
const config = require('../knexfile');
const knex = require('knex')(config);

module.exports = knex;