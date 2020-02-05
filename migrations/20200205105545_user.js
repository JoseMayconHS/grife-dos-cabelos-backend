
exports.up = function(knex) {
  return knex.schema.createTable('user', table => {
    table.increments('id').primary()
    table.string('username').notNull().unique()
    table.string('cellphone').notNull()
    table.string('password').notNull()
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('user')
};
