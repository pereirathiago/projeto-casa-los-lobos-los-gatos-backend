import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.uuid('uuid').defaultTo(knex.fn.uuid()).notNullable().unique()
    table.string('name', 255).notNullable()
    table.string('email', 255).notNullable().unique()
    table.string('password', 255).notNullable()
    table.enum('role', ['sponsor', 'admin']).notNullable().defaultTo('sponsor')
    table.boolean('active').notNullable().defaultTo(true)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}
