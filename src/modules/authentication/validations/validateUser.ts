import { NextFunction, Request, Response } from 'express'
import { registerUserSchema } from './schemas/registerValidation.js'

async function validateRegister(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const validatedData = await registerUserSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  })

  req.body = validatedData

  next()
}

export { validateRegister }
