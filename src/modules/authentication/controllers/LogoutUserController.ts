import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IAccessTokenPayload } from '../dtos/IUserSessionDTO.js'
import { LogoutUserUseCase } from '../useCases/LogoutUserUseCase.js'

class LogoutUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const tokenPayload = request.user as IAccessTokenPayload
    console.log(tokenPayload)

    const logoutUserUseCase = container.resolve(LogoutUserUseCase)

    await logoutUserUseCase.execute(tokenPayload)

    return response.status(200).json({
      message: 'Usuário desconectado com sucesso!',
    })
  }
}

export { LogoutUserController }
