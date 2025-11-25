import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetSponsorDashboardUseCase } from '../useCases/GetSponsorDashboardUseCase.js'

class SponsorDashboardController {
  async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id

    const getSponsorDashboardUseCase = container.resolve(GetSponsorDashboardUseCase)
    const dashboard = await getSponsorDashboardUseCase.execute(userId)

    return response.json(dashboard)
  }
}

export { SponsorDashboardController }
