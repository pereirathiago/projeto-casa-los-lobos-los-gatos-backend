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
    throw new UnauthorizedError('Token ausente')
  }

  const [, token] = authHeader.split(' ')

  if (!token) {
    throw new UnauthorizedError('Token ausente')
  }

  let payload: IAccessTokenPayload
  try {
    payload = verify(token, config.auth.secret_token) as IAccessTokenPayload
  } catch (error) {
    throw new UnauthorizedError('Token inválido ou expirado')
  }

  const userRepository = container.resolve<IUserRepository>('UserRepository')
  const user = await userRepository.findByUuid(payload.sub)

  if (!user) {
    throw new UnauthorizedError('Usuário não encontrado')
  }

  if (!user.active) {
    throw new UnauthorizedError('Conta de usuário inativa')
  }

  if (user.deleted) {
    throw new UnauthorizedError('Conta de usuário excluída')
  }

  const expectedVersion = createHash('md5')
    .update(user.uuid + user.password)
    .digest('hex')

  if (payload.version !== expectedVersion) {
    throw new UnauthorizedError('Token invalidado (senha alterada)')
  }
  if (!payload.parent || !payload.parent.uuid) {
    throw new UnauthorizedError('Token inválido: sessão ausente')
  }

  const userSessionRepository = container.resolve<IUserSessionRepository>('UserSessionRepository')

  const parentSession = await userSessionRepository.findById(payload.parent.uuid)

  if (!parentSession) {
    throw new UnauthorizedError('Sessão invalidada ou expirada (logout)')
  }

  if (new Date(parentSession.expires_date) < new Date()) {
    throw new UnauthorizedError('Sessão expirada')
  }

  request.user = {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    role: user.role,
    is_master: user.is_master,
    deleted: user.deleted,
    parent: payload.parent,
  }

  next()
}
