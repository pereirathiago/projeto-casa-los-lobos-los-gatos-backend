import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('animal_tags', (table) => {
    table.increments('id').primary()
    table.uuid('uuid').defaultTo(knex.fn.uuid()).notNullable().unique()
    table.integer('animal_id').unsigned().notNullable()
    table.string('label', 100).notNullable()
    table.string('color', 7).notNullable() // Formato hex: #RRGGBB
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

    // Foreign key
    table
      .foreign('animal_id')
      .references('id')
      .inTable('animals')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

    // Índices
    table.index(['animal_id'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('animal_tags')
}
