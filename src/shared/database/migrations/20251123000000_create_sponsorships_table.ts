import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sponsorships', (table) => {
    table.increments('id').primary()
    table.uuid('uuid').defaultTo(knex.fn.uuid()).notNullable().unique()
    table.integer('user_id').unsigned().notNullable()
    table.integer('animal_id').unsigned().notNullable()
    table.boolean('active').notNullable().defaultTo(true)
    table.boolean('deleted').defaultTo(false).notNullable()
    table.timestamps(true, true)

    table
      .foreign('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

    table
      .foreign('animal_id')
      .references('id')
      .inTable('animals')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

    table.index(['user_id'])
    table.index(['animal_id'])
    table.index(['active'])
    table.index(['deleted'])
    table.index(['created_at'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('sponsorships')
}
