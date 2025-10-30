import { config } from '@src/config/index.js'
import { UnauthorizedError } from '@src/shared/errors/http.js'
import { compare } from 'bcrypt'
import { sign, SignOptions } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import { IAuthenticateUserDTO } from '../dtos/IUserSessionDTO.js'
import { IUserRepository } from '../repositories/UserRepository.js'
import { IUserSessionRepository } from '../repositories/UserSessionRepository.js'

export interface IAuthenticateUserResponse {
  token: string
  refreshToken: string
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserSessionRepository')
    private userSessionRepository: IUserSessionRepository,
  ) {}

  async execute({ email, password }: IAuthenticateUserDTO): Promise<IAuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new UnauthorizedError('Credenciais inválidas')
    }

    const token = sign(
      {
        role: user.role,
      },
      config.auth.secret_token,
      {
        subject: String(user.id),
        expiresIn: config.auth.expires_in_token,
      } as SignOptions,
    )

    return {
      token,
      refreshToken,
    }
  }
}
