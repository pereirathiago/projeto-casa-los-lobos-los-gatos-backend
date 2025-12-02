import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetMyDonationUseCase } from '../useCases/GetMyDonationUseCase.js'

class GetMyDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { uuid } = request.params
    const userId = request.user.id

    const getMyDonationUseCase = container.resolve(GetMyDonationUseCase)
    const donation = await getMyDonationUseCase.execute(uuid, userId)

    return response.json(donation)
  }
}

export { GetMyDonationController }
