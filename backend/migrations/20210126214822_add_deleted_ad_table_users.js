// const Knex = require("knex");

exports.up = function (knex) {
    return knex.schema.alterTable('wm_backend.users', table => {
        table.timestamp('deletedAt')
    })
};

exports.down = function (knex) {
    return knex.schema.alterTable('wm_backend.users', table => {
        table.dropColumn('deletedAt')
    })
};
