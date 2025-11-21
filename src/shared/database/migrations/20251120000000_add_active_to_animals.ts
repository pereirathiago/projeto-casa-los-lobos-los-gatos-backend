import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('animals', (table) => {
    table.boolean('active').defaultTo(true).notNullable()
    table.index(['active'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('animals', (table) => {
    table.dropIndex(['active'])
    table.dropColumn('active')
  })
}
