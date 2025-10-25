import { config } from '@config/index.js'
import { AppError } from '@shared/errors/AppError.js'
import { compare } from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import { IAuthenticateUserRequest, IAuthenticateUserResponse } from '../repositories/interfaces/auth.js'
import { IUserRepository } from '../repositories/UserRepository.js'
import { IUserSessionRepository } from '../repositories/UserSessionRepository.js'

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserSessionRepository')
    private userSessionRepository: IUserSessionRepository,
  ) {}

  async execute({ email, password }: IAuthenticateUserRequest): Promise<IAuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email)

    const { sign } = jwt

    if (!user) {
      throw new AppError('Email or password incorrect!', 401)
    }

    if (!user.active) {
      throw new AppError('User account is inactive!', 401)
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect!', 401)
    }

    const { secret_token, expires_in_token, secret_refreshToken, expires_in_refreshToken, expires_refreshToken_days } =
      config.auth

    // Generate access token
    const token = sign({}, secret_token, {
      subject: user.id,
      expiresIn: expires_in_token,
    } as SignOptions)

    // Generate refresh token
    const refreshToken = sign({ email }, secret_refreshToken, {
      subject: user.id,
      expiresIn: expires_in_refreshToken,
    } as SignOptions)

    // Calculate refresh token expiration date
    const refreshTokenExpiresDate = new Date()
    refreshTokenExpiresDate.setDate(refreshTokenExpiresDate.getDate() + expires_refreshToken_days)

    // Save refresh token in database
    await this.userSessionRepository.create({
      user_id: user.id,
      refresh_token: refreshToken,
      expires_date: refreshTokenExpiresDate,
    })

    const response: IAuthenticateUserResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    }

    return response
  }
}
