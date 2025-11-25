import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetDonationsBySponsorUseCase } from '../useCases/GetDonationsBySponsorUseCase.js'

class GetDonationsBySponsorController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id

    const getDonationsBySponsorUseCase = container.resolve(GetDonationsBySponsorUseCase)
    const donations = await getDonationsBySponsorUseCase.execute(userId)

    return response.json(donations)
  }
}

export { GetDonationsBySponsorController }
