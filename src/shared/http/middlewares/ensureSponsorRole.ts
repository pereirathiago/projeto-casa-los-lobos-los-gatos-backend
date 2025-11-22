import { NextFunction, Request, Response } from 'express'
import { ForbiddenError } from '../../errors/index.js'

async function ensureSponsorRole(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const user = request.user

  if (!user) {
    throw new ForbiddenError()
  }

  if (user.role !== 'sponsor') {
    throw new ForbiddenError()
  }

  next()
}

export { ensureSponsorRole }
