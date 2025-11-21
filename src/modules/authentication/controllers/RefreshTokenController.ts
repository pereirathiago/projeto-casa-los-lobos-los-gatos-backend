import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IRefreshTokenDTO } from '../dtos/IUserSessionDTO.js'
import { RefreshTokenUseCase } from '../useCases/RefreshTokenUseCase.js'

export class RefreshTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const data = req.body as IRefreshTokenDTO

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase)

    const result = await refreshTokenUseCase.execute(data)

    return res.status(200).json(result)
  }
}
