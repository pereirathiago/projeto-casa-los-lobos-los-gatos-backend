import { AppError } from './AppError.js'

export class ServerError extends AppError {
  constructor(error?: Error) {
    super(error ? error.message : 'Internal server error', 500)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not found') {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409)
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, 400)
  }
}

export interface ValidationErrorDetail {
  field: string
  message: string
}

export class ValidationError extends AppError {
  public readonly errors: ValidationErrorDetail[]

  constructor(errors: ValidationErrorDetail[], message: string = 'Validation Error') {
    super(message, 422)
    this.errors = errors
  }

  static fromYup(yupError: any): ValidationError {
    const errors: ValidationErrorDetail[] = []

    if (yupError.inner && yupError.inner.length > 0) {
      yupError.inner.forEach((err: any) => {
        errors.push({
          field: err.path || 'unknown',
          message: err.message,
        })
      })
    } else {
      errors.push({
        field: yupError.path || 'unknown',
        message: yupError.message,
      })
    }

    return new ValidationError(errors)
  }
}
