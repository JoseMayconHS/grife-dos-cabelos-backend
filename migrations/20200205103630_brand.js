
exports.up = function(knex) {
  return knex.schema.createTable('brand', table => {
    table.increments('id').primary()
    table.string('title').notNull().unique()
    table.integer('products').unsigned().defaultTo(0)
    table.string('thumbnail').notNull()
    table.string('insired').notNull()
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('brand')
};
