import { Request, Response } from 'express'
import { container, injectable } from 'tsyringe'
import { GetAllSponsorshipsUseCase } from '../useCases/GetAllSponsorshipsUseCase.js'

@injectable()
export class GetAllSponsorshipsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getAllSponsorshipsUseCase = container.resolve(GetAllSponsorshipsUseCase)

    const sponsorships = await getAllSponsorshipsUseCase.execute()

    return response.status(200).json(sponsorships)
  }
}
