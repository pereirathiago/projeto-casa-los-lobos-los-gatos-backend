import { ForbiddenError } from '../../errors/index.js'
import { NextFunction, Request, Response } from 'express'

async function ensureAdminRole(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const user = request.user

  if (!user) {
    throw new ForbiddenError()
  }

  if (user.role !== 'admin') {
    throw new ForbiddenError()
  }

  next()
}

export { ensureAdminRole }
