import { NextFunction, Request, Response } from 'express'
import { refreshTokenValidationSchema } from './schemas/refreshTokenValidation.js'

export async function validateRefreshToken(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const validatedData = await refreshTokenValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  })

  req.body = validatedData

  next()
}
