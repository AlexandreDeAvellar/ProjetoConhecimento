const { default: Axios } = require("axios");

exports.up = function (knex, Promise) {
    return knex.schema.createTable('wm_backend.users', table => {
        table.increments('id').primary();
        table.string('name').notNull();
        table.string('email').notNull().unique();
        table.string('password').notNull();
        table.boolean('admin').notNull().defaultTo(false);

    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('wm_backend.users');
};


