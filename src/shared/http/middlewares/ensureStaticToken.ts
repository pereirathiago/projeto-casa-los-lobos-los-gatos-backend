import { config } from '@config/index.js'
import { UnauthorizedError } from '@shared/errors/http.js'
import { NextFunction, Request, Response } from 'express'

export async function ensureStaticToken(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new UnauthorizedError('Token ausente')
  }

  const [, token] = authHeader.split(' ')

  if (!token) {
    throw new UnauthorizedError('Token ausente')
  }

  if (token !== config.auth.static_api_token) {
    throw new UnauthorizedError('Token inválido')
  }

  next()
}
