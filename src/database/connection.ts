import { knex as setupKnex, Knex } from 'knex'
import { config } from '../config'

const dbConfig: Knex.Config = {
  client: 'postgresql',
  connection: {
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: './src/database/migrations',
    tableName: 'knex_migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/database/seeds',
    extension: 'ts',
  },
}

export const db = setupKnex(dbConfig)
