import { NextFunction, Request, Response } from 'express'
import { createAdminSchema, updateAdminSchema } from './schemas/adminValidation.js'

async function validateCreateAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const validatedData = await createAdminSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  })

  req.body = validatedData

  next()
}

async function validateUpdateAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const validatedData = await updateAdminSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  })

  req.body = validatedData

  next()
}

export { validateCreateAdmin, validateUpdateAdmin }
