import { config } from '@src/config/index.js'
import { AppError } from '@src/shared/errors/AppError.js'
import { UnauthorizedError } from '@src/shared/errors/http.js'
import { compare } from 'bcrypt'
import { createHash } from 'crypto'
import jwt from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import { IAuthenticateUserDTO, IAuthenticateUserResponse } from '../dtos/IUserSessionDTO.js'
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js'
import { IUserSessionRepository } from '../repositories/interfaces/IUserSessionRepository.js'

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserSessionRepository')
    private userSessionRepository: IUserSessionRepository,
  ) {}

  async execute({ email, password }: IAuthenticateUserDTO): Promise<IAuthenticateUserResponse> {
    const { sign } = jwt

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    if (!user.active) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const refreshExpiresInSeconds = this.parseExpiresIn(config.auth.expires_in_refreshToken)
    const refreshExpiresDate = new Date(Date.now() + refreshExpiresInSeconds * 1000)

    const refreshToken = sign(
      {
        type: 'refresh',
        email: user.email,
      },
      config.auth.secret_refreshToken,
      {
        subject: user.uuid,
        expiresIn: refreshExpiresInSeconds,
      },
    )

    const newSession = await this.userSessionRepository.create({
      user_id: user.id,
      refresh_token: refreshToken,
      expires_date: refreshExpiresDate,
    })

    const sessionId = newSession.id

    const passwordVersion = createHash('md5')
      .update(user.uuid + user.password)
      .digest('hex')

    const parentClaim = {
      uuid: sessionId,
      exp: refreshExpiresDate.getTime() / 1000,
    }

    const expiresInSeconds = this.parseExpiresIn(config.auth.expires_in_token)

    const token = sign(
      {
        email: user.email,
        role: user.role,
        version: passwordVersion,
        parent: parentClaim,
      },
      config.auth.secret_token,
      {
        subject: user.uuid,
        expiresIn: expiresInSeconds,
      },
    )

    return {
      token,
      expires_in: expiresInSeconds,
      refreshToken: refreshToken,
      user: {
        id: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([mhd])$/)

    if (!match) {
      throw new AppError('Invalid expires_in format in configuration')
    }

    const value = parseInt(match[1], 10)
    const unit = match[2]

    switch (unit) {
      case 'm':
        return value * 60
      case 'h':
        return value * 60 * 60
      case 'd':
        return value * 60 * 60 * 24
      default:
        throw new AppError('Invalid time unit in expires_in configuration')
    }
  }
}

export { AuthenticateUserUseCase }
