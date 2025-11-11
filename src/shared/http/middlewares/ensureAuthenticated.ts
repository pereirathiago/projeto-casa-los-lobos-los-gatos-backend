import { config } from '@config/index.js'
import { UnauthorizedError } from '@shared/errors/http.js'
import { IAccessTokenPayload } from '@src/modules/authentication/dtos/IUserSessionDTO.js'
import { IUserRepository } from '@src/modules/authentication/repositories/interfaces/IUserRepository.js'
import { IUserSessionRepository } from '@src/modules/authentication/repositories/interfaces/IUserSessionRepository.js'
import { createHash } from 'crypto'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { container } from 'tsyringe'

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization
  const { verify } = jwt

  if (!authHeader) {
    throw new UnauthorizedError('Token missing')
  }

  const [, token] = authHeader.split(' ')

  if (!token) {
    throw new UnauthorizedError('Token missing')
  }

  let payload: IAccessTokenPayload
  try {
    payload = verify(token, config.auth.secret_token) as IAccessTokenPayload
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token')
  }

  const userRepository = container.resolve<IUserRepository>('UserRepository')
  const user = await userRepository.findByUuid(payload.sub)

  if (!user) {
    throw new UnauthorizedError('User not found')
  }

  if (!user.active) {
    throw new UnauthorizedError('User account is inactive')
  }

  const expectedVersion = createHash('md5')
    .update(user.uuid + user.password)
    .digest('hex')

  if (payload.version !== expectedVersion) {
    throw new UnauthorizedError('Token invalidated (password changed)')
  }
  if (!payload.parent || !payload.parent.uuid) {
    throw new UnauthorizedError('Invalid token: missing parent session')
  }

  const userSessionRepository = container.resolve<IUserSessionRepository>('UserSessionRepository')

  const parentSession = await userSessionRepository.findById(payload.parent.uuid)

  if (!parentSession) {
    throw new UnauthorizedError('Session invalidated or expired (logout)')
  }

  if (new Date(parentSession.expires_date) < new Date()) {
    throw new UnauthorizedError('Session expired')
  }

  request.user = {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    role: user.role,
    parent: payload.parent,
  }

  next()
}
