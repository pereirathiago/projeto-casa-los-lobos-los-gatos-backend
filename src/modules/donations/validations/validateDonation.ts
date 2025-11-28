import { BadRequestError } from '@shared/errors/http.js'
import { NextFunction, Request, Response } from 'express'
import { createDonationSchema } from './schemas/donationValidation.js'

export async function validateCreateDonation(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await createDonationSchema.validate(request.body, { abortEarly: false })
    next()
  } catch (error: any) {
    throw new BadRequestError(error.errors.join(', '))
  }
}
