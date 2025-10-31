import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IAuthenticateUserDTO } from '../dtos/IUserSessionDTO.js'
import { AuthenticateUserUseCase } from '../useCases/AuthenticateUserUseCase.js'

export class AuthenticateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const data = req.body as IAuthenticateUserDTO

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase)

    const result = await authenticateUserUseCase.execute(data)

    return res.status(200).json(result)
  }
}
