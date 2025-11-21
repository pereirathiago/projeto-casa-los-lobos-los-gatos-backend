import { ValidationError } from '@shared/errors/http.js'
import { NextFunction, Request, Response } from 'express'
import { createAnimalSchema, updateAnimalSchema } from './schemas/animalValidation.js'

export async function validateCreateAnimal(req: Request, res: Response, next: NextFunction) {
  try {
    // Parse tags se vier como string
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        req.body.tags = JSON.parse(req.body.tags)
      } catch (error) {
        throw new ValidationError([
          {
            field: 'tags',
            message: 'Tags devem ser um JSON válido',
          },
        ])
      }
    }

    // Parse age para number
    if (req.body.age) {
      req.body.age = parseFloat(req.body.age)
    }

    await createAnimalSchema.validate(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationError = ValidationError.fromYup(error)
      next(validationError)
    } else {
      next(error)
    }
  }
}

export async function validateUpdateAnimal(req: Request, res: Response, next: NextFunction) {
  try {
    // Parse tags se vier como string
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        req.body.tags = JSON.parse(req.body.tags)
      } catch (error) {
        throw new ValidationError([
          {
            field: 'tags',
            message: 'Tags devem ser um JSON válido',
          },
        ])
      }
    }

    // Parse age para number
    if (req.body.age) {
      req.body.age = parseFloat(req.body.age)
    }

    await updateAnimalSchema.validate(req.body, { abortEarly: false })
    next()
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const validationError = ValidationError.fromYup(error)
      next(validationError)
    } else {
      next(error)
    }
  }
}
