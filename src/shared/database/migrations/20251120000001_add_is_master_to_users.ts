import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.boolean('is_master').defaultTo(false).notNullable()
    table.index(['is_master'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.dropIndex(['is_master'])
    table.dropColumn('is_master')
  })
}
