import { NextFunction, Request, Response } from 'express'
import { createSponsorSchema, updateSponsorSchema } from './schemas/sponsorValidation.js'

async function validateCreateSponsor(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const validatedData = await createSponsorSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  })

  req.body = validatedData

  next()
}

async function validateUpdateSponsor(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const validatedData = await updateSponsorSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  })

  req.body = validatedData

  next()
}

export { validateCreateSponsor, validateUpdateSponsor }
