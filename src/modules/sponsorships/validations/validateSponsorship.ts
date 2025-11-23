import { BadRequestError } from '@shared/errors/http.js'
import { NextFunction, Request, Response } from 'express'
import { createSponsorshipSchema } from './schemas/sponsorshipValidation.js'

export async function validateCreateSponsorship(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await createSponsorshipSchema.validate(request.body, { abortEarly: false })
    next()
  } catch (error: any) {
    throw new BadRequestError(error.errors.join(', '))
  }
}
