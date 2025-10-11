import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { LogoutUserUseCase } from '../use-cases/LogoutUserUseCase'

export class LogoutUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id: userId } = request.user
      const { refreshToken } = request.body

      const logoutUserUseCase = container.resolve(LogoutUserUseCase)

      await logoutUserUseCase.execute({
        userId,
        refreshToken,
      })

      return response.status(200).json({
        message: 'User logged out successfully',
      })
    } catch (error) {
      return response.status(400).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      })
    }
  }
}
