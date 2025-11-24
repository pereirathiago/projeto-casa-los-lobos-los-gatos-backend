import { Request, Response } from 'express'
import { container, injectable } from 'tsyringe'
import { GetSponsorshipBySponsorUseCase } from '../useCases/GetSponsorshiBySponsorUseCase.js'

@injectable()
class GetSponsorshipBySponsorController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user

    const getSponsorshipsBySponsorUseCase = container.resolve(GetSponsorshipBySponsorUseCase)

    const sponsorships = await getSponsorshipsBySponsorUseCase.execute(id)

    return response.status(200).json(sponsorships)
  }
}

export { GetSponsorshipBySponsorController }
