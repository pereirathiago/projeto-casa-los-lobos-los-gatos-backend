import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { AuthenticateUserUseCase } from '../use-cases/AuthenticateUserUseCase'

export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { password, email } = request.body

      const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase)

      const result = await authenticateUserUseCase.execute({
        password,
        email,
      })

      return response.json(result)
    } catch (error) {
      return response.status(400).json({
        error: error instanceof Error ? error.message : 'Internal server error',
      })
    }
  }
}
