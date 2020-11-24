
exports.up = function (knex, Promise) {
    return knex.schema.createTable('wm_backend.articles', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('description').notNull()
        table.string('imageUrl', 1000)
        table.binary('content').notNull()
        table.integer('userId').references('id')
            .inTable('wm_backend.users').notNull()
        table.integer('categoryId').references('id')
            .inTable('wm_backend.categories').notNull()
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('wm_backend.articles');
};
