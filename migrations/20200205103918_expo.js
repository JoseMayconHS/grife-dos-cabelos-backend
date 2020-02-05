
exports.up = function(knex) {
  return knex.schema.createTable('expo', table => {
    table.increments('id').primary() 
    table.string('token').notNull()
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('expo')
};
