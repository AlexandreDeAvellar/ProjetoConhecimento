
exports.up = function (knex, Promise) {
    return knex.schema.createTable('wm_backend.categories', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.integer('parentId').references('id')
            .inTable('wm_backend.categories')
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('wm_backend.categories');
};
