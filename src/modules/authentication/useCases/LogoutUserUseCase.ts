import { AppError } from '@shared/errors/AppError.js'
import { inject, injectable } from 'tsyringe'
import { IAccessTokenPayload } from '../dtos/IUserSessionDTO.js'
import { IUserSessionRepository } from '../repositories/interfaces/IUserSessionRepository.js'

@injectable()
class LogoutUserUseCase {
  constructor(
    @inject('UserSessionRepository')
    private userSessionRepository: IUserSessionRepository,
  ) {}

  async execute(tokenPayload: IAccessTokenPayload): Promise<void> {
    if (!tokenPayload.parent || !tokenPayload.parent.uuid) {
      throw new AppError('Invalid token: missing parent session', 401)
    }

    const sessionId = tokenPayload.parent.uuid

    const invalidated = await this.userSessionRepository.invalidateById(sessionId)

    if (!invalidated) {
      throw new AppError('Session not found or already logged out', 404)
    }
  }
}

export { LogoutUserUseCase }
