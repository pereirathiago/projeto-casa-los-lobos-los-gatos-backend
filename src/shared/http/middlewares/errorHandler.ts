import { AppError } from '@shared/errors/AppError.js'
import { NextFunction, Request, Response } from 'express'

export function errorHandler(error: Error, request: Request, response: Response, next: NextFunction): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: error.message,
    })
  }

  console.error(error)

  return response.status(500).json({
    error: 'Internal server error',
  })
}
