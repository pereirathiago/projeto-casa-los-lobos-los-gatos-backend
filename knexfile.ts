import type { Knex } from 'knex'
import { config } from './src/config/index.ts'

const dbConfig: { [key: string]: Knex.Config } = {
  development: {
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
      directory: './src/shared/database/migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/shared/database/seeds',
      extension: 'ts',
    },
  },
  production: {
    client: 'postgresql',
    connection: {
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.user,
      password: config.database.password,
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './src/shared/database/migrations',
      tableName: 'knex_migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/shared/database/seeds',
      extension: 'ts',
    },
  },
}

export default dbConfig
