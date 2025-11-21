import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.text('refresh_token').notNullable()
    table.boolean('is_active').notNullable().defaultTo(true)
    table.timestamp('expires_date').notNullable()
    table.timestamps(true, true)
    table.index(['user_id', 'is_active', 'refresh_token'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_sessions')
}
