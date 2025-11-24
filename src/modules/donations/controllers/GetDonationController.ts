import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetDonationUseCase } from '../useCases/GetDonationUseCase.js'

class GetDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { uuid } = request.params

    const getDonationUseCase = container.resolve(GetDonationUseCase)
    const donation = await getDonationUseCase.execute(uuid)

    return response.json(donation)
  }
}

export { GetDonationController }
