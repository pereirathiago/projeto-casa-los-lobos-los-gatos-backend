import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.boolean('deleted').defaultTo(false).notNullable()
    table.index(['deleted'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('users', (table) => {
    table.dropIndex(['deleted'])
    table.dropColumn('deleted')
  })
}
