import { NextFunction, Request, Response } from 'express'
import { loginValidationSchema } from './schemas/loginValidation.js'

async function validateLogin(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const validatedData = await loginValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  })

  req.body = validatedData

  next()
}

export { validateLogin }
