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
  constructor() {
    super('Forbidden', 403)
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

export class ValidationError extends AppError {
  public readonly details: Array<{ field: string; error: string }>

  constructor(details: Array<{ field: string; error: string }>) {
    super('Validation error', 422)
    this.details = details
  }
}
