import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { container } from 'tsyringe'
import { IUserRepository } from '../repositories/UserRepository'
import { AppError } from '../shared/errors/AppError'
import { config } from '../config'

interface IPayload {
  sub: string
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError('Token missing!', 401)
    }

    const [, token] = authHeader.split(' ')

    if (!token) {
      throw new AppError('Token missing!', 401)
    }

    const { sub: userId } = verify(token, config.auth.secret_token) as IPayload

    const userRepository = container.resolve<IUserRepository>('UserRepository')
    const user = await userRepository.findById(userId)

    if (!user) {
      throw new AppError('User not found!', 401)
    }

    if (!user.active) {
      throw new AppError('User account is inactive!', 401)
    }

    request.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    next()
  } catch (error) {
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        error: error.message,
      })
      return
    }

    response.status(401).json({
      error: 'Invalid token!',
    })
  }
}
