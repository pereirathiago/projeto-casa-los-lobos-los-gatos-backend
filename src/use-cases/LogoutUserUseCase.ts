import { inject, injectable } from 'tsyringe'
import { IUserSessionRepository } from '../repositories/UserSessionRepository'
import { AppError } from '../shared/errors/AppError'
import { ILogoutUserRequest } from '../interfaces/auth'

@injectable()
export class LogoutUserUseCase {
  constructor(
    @inject('UserSessionRepository')
    private userSessionRepository: IUserSessionRepository,
  ) {}

  async execute({ userId, refreshToken }: ILogoutUserRequest): Promise<void> {
    // Find the session by refresh token
    const session = await this.userSessionRepository.findByRefreshToken(refreshToken)

    if (!session) {
      throw new AppError('Invalid refresh token!', 401)
    }

    if (session.user_id !== userId) {
      throw new AppError('Unauthorized!', 401)
    }

    // Deactivate the session
    await this.userSessionRepository.update(session.id, {
      is_active: false,
    })

    // Clean up expired sessions
    await this.userSessionRepository.deleteExpiredSessions()
  }
}
