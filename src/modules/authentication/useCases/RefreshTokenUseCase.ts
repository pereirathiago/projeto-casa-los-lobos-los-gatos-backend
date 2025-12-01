import { config } from '@src/config/index.js'
import { AppError } from '@src/shared/errors/AppError.js'
import { UnauthorizedError } from '@src/shared/errors/http.js'
import { createHash } from 'crypto'
import jwt from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import { IRefreshTokenDTO, IRefreshTokenResponse } from '../dtos/IUserSessionDTO.js'
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js'
import { IUserSessionRepository } from '../repositories/interfaces/IUserSessionRepository.js'

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserSessionRepository')
    private userSessionRepository: IUserSessionRepository,
  ) {}

  async execute({ refreshToken }: IRefreshTokenDTO): Promise<IRefreshTokenResponse> {
    const { verify, sign } = jwt

    let decoded: any
    try {
      decoded = verify(refreshToken, config.auth.secret_refreshToken)
    } catch (error) {
      throw new UnauthorizedError('Refresh token inválido ou expirado')
    }

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedError('Tipo de token inválido')
    }

    const session = await this.userSessionRepository.findByRefreshToken(refreshToken)

    if (!session) {
      throw new UnauthorizedError('Sessão não encontrada ou inválida')
    }

    if (!session.is_active) {
      throw new UnauthorizedError('Sessão invalidada (logout)')
    }

    if (new Date(session.expires_date) < new Date()) {
      throw new UnauthorizedError('Sessão expirada')
    }

    const userUuid = decoded.sub
    const user = await this.userRepository.findByUuid(userUuid)

    if (!user) {
      throw new UnauthorizedError('Usuário não encontrado')
    }

    if (!user.active) {
      throw new UnauthorizedError('Conta de usuário inativa')
    }

    const passwordVersion = createHash('md5')
      .update(user.uuid + user.password)
      .digest('hex')

    const parentClaim = {
      uuid: session.id,
      exp: new Date(session.expires_date).getTime() / 1000,
    }

    const expiresInSeconds = this.parseExpiresIn(config.auth.expires_in_token)

    const newAccessToken = sign(
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
      token: newAccessToken,
      expires_in: expiresInSeconds,
    }
  }

  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([mhd])$/)

    if (!match) {
      throw new AppError('Formato inválido para expires_in na configuração')
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
        throw new AppError('Unidade de tempo inválida na configuração expires_in')
    }
  }
}

export { RefreshTokenUseCase }
