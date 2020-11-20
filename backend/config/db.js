const config = require('../knexfile');
const kenx = require('knex')(config);

module.exports = kenx;