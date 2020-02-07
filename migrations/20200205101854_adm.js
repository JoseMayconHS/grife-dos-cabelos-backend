
exports.up = function(knex) {
  return knex.schema.createTable('adm', table => {
    table.increments('id').primary()
    table.string('username').notNull().unique()
    table.string('email').notNull().unique()
    table.string('password').notNull()
    table.string('notifications').defaultTo(JSON.stringify([{
      date: 'Notificação de exemplo',
      success: true,
      title: 'Primeira notificação 😃',
      body: 'Você erra 💯% dos chutes que não dá! ⚽'
    }]))
    table.boolean('adm').defaultTo(true)
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('adm')
};
