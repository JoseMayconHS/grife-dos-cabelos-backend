
exports.up = function(knex) {
  return knex.schema.createTable('type', table => {
    table.increments('id').primary()
    table.string('name').notNull().unique()
    table.integer('products').defaultTo(0)
    table.boolean('swiper').defaultTo(false)
    table.string('insired').notNull()
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('type')
};
