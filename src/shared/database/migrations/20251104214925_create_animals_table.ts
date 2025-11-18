import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('animals', (table) => {
    table.increments('id').primary()
    table.uuid('uuid').defaultTo(knex.fn.uuid()).notNullable().unique()
    table.string('name', 255).notNullable()
    table.enum('type', ['dog', 'cat']).notNullable()
    table.string('breed', 255).notNullable()
    table.decimal('age', 4, 1).notNullable().checkBetween([0, 30])
    table.text('description').notNullable()
    table.string('photo_url', 500).nullable()
    table.timestamps(true, true)

    // Índices para melhorar performance de busca
    table.index(['type'])
    table.index(['breed'])
    table.index(['created_at'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('animals')
}
