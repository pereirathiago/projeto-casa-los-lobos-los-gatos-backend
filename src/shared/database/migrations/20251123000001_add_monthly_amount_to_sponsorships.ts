import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('sponsorships', (table) => {
    table.decimal('monthly_amount', 10, 2).notNullable().defaultTo(0)
    table.index(['monthly_amount'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('sponsorships', (table) => {
    table.dropIndex(['monthly_amount'])
    table.dropColumn('monthly_amount')
  })
}
