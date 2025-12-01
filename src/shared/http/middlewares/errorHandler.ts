import { AppError } from '@shared/errors/AppError.js'
import { ValidationError } from '@shared/errors/http.js'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import * as Yup from 'yup'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response {
  const { JsonWebTokenError, TokenExpiredError } = jwt

  console.error('Error Handler:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  })

  if (err instanceof Yup.ValidationError) {
    const validationError = ValidationError.fromYup(err)
    return res.status(validationError.statusCode).json({
      message: validationError.message,
      errors: validationError.errors,
    })
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    })
  }

  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      message: 'Token expirado',
    })
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      message: 'Token inválido',
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    })
  }

  return res.status(500).json({
    message: 'Internal server error',
  })
}
