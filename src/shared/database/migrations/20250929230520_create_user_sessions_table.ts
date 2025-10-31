import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('user_id').notNullable()
    table.text('refresh_token').notNullable()
    table.timestamp('expires_date').notNullable()
    table.boolean('is_active').notNullable().defaultTo(true)
    table.timestamps(true, true)

    // Foreign key
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')

    // Index for better performance
    table.index(['user_id', 'is_active'])
    table.index('refresh_token')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_sessions')
}
