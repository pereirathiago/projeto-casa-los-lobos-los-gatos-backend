import { ForbiddenError } from '@shared/errors/index.js'
import { NextFunction, Request, Response } from 'express'

export async function ensureMasterAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const user = req.user

  if (!user) {
    throw new ForbiddenError('Acesso negado')
  }

  if (user.role !== 'admin' || !user.is_master) {
    throw new ForbiddenError('Sem permissão de administrador master')
  }

  next()
}
