import { ForbiddenError } from '../../errors/index.js'
import { NextFunction, Request, Response } from 'express'

async function ensureAdminRole(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const user = request.user

  if (!user) {
    throw new ForbiddenError('Acesso negado')
  }

  if (user.role !== 'admin') {
    throw new ForbiddenError('Sem permissão de administrador')
  }

  if (user.deleted === true) {
    throw new ForbiddenError('Sem permissão de administrador')
  }

  next()
}

export { ensureAdminRole }
