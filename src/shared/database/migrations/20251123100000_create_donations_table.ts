import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('donations', (table) => {
    table.increments('id').primary()
    table.uuid('uuid').defaultTo(knex.fn.uuid()).notNullable().unique()
    table.integer('user_id').unsigned().notNullable()
    table.decimal('amount', 10, 2).notNullable()
    table.date('donation_date').notNullable()
    table.enum('status', ['pending', 'confirmed']).notNullable().defaultTo('pending')
    table.integer('confirmed_by').unsigned().nullable()
    table.timestamp('confirmed_at').nullable()
    table.text('notes').nullable()
    table.boolean('deleted').defaultTo(false).notNullable()
    table.timestamps(true, true)

    // Foreign keys
    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

    table
      .foreign('confirmed_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL')
      .onUpdate('CASCADE')

    // Índices
    table.index(['user_id'])
    table.index(['status'])
    table.index(['deleted'])
    table.index(['donation_date'])
    table.index(['confirmed_by'])
    table.index(['created_at'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('donations')
}
