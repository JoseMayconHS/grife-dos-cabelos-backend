
exports.up = function(knex) {
  return knex.schema.createTable('notifications', table => {
    table.increments('id').primary()
    table.string('date').notNull()
    table.boolean('success').notNull()
    table.string('title')
    table.string('body')
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('notifications')
};
