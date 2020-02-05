
exports.up = function(knex) {
  return knex.schema.createTable('product', table => {
    table.increments('id').primary()
    table.string('title').notNull().unique()
    table.string('description').defaultTo('')
    table.string('item_included').defaultTo('[]')
    table.string('thumbnail').notNull()
    table.string('price').notNull().defaultTo(`{
      _from: {
        type: Number,
        default: 0
      },
      to: {
        type: Number,
        required: true
      }
    }`)

    table.string('brand').notNull()
    table.integer('brand_id').unsigned()
    table.foreign('brand_id').references('id').inTable('brand')

    table.string('type').notNull()
    table.integer('type_id').unsigned()
    table.foreign('type_id').references('id').inTable('type')

    table.boolean('promotion').notNull().defaultTo(false)
    table.string('insired').notNull()
    table.string('updated')
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('product')
};
