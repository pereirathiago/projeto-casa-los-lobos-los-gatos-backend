import 'dotenv/config'

interface Config {
  server: {
    port: number
    nodeEnv: 'development' | 'production' | 'test'
    isDevelopment: boolean
    isProduction: boolean
  }
  database: {
    host: string
    port: number
    name: string
    user: string
    password: string
  }
  auth: {
    secret_token: string
    expires_in_token: string
    secret_refreshToken: string
    expires_in_refreshToken: string
    expires_refreshToken_days: number
    static_api_token: string
  }
}

function getEnvVar(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Variável de ambiente ${key} é obrigatória, mas não está definida`)
  }

  return value
}

function getEnvVarAsNumber(key: string): number {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Variável de ambiente ${key} é obrigatória, mas não está definida`)
  }

  const numValue = Number(value)
  if (isNaN(numValue)) {
    throw new Error(`Variável de ambiente ${key} deve ser um número válido`)
  }

  return numValue
}

const serverConfig: Config['server'] = {
  port: getEnvVarAsNumber('PORT'),
  nodeEnv: (getEnvVar('NODE_ENV') as Config['server']['nodeEnv']) || 'development',
  isDevelopment: getEnvVar('NODE_ENV') === 'development',
  isProduction: getEnvVar('NODE_ENV') === 'production',
}

const databaseConfig: Config['database'] = {
  host: getEnvVar('DB_HOST'),
  port: getEnvVarAsNumber('DB_PORT'),
  name: getEnvVar('DB_NAME'),
  user: getEnvVar('DB_USER'),
  password: getEnvVar('DB_PASSWORD'),
}

const authConfig: Config['auth'] = {
  secret_token: getEnvVar('JWT_SECRET_TOKEN'),
  expires_in_token: getEnvVar('JWT_EXPIRES_IN') || '480m',
  secret_refreshToken: getEnvVar('JWT_SECRET_REFRESH_TOKEN'),
  expires_in_refreshToken: getEnvVar('JWT_REFRESH_EXPIRES_IN') || '30d',
  expires_refreshToken_days: Number(getEnvVar('JWT_REFRESH_EXPIRES_DAYS') || '30'),
  static_api_token: getEnvVar('STATIC_API_TOKEN'),
}

const config: Config = {
  server: serverConfig,
  database: databaseConfig,
  auth: authConfig,
}

export { config }
