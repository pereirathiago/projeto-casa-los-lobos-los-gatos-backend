import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetAllDonationsUseCase } from '../useCases/GetAllDonationsUseCase.js'

class GetAllDonationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getAllDonationsUseCase = container.resolve(GetAllDonationsUseCase)
    const donations = await getAllDonationsUseCase.execute()
    return response.json(donations)
  }
}

export { GetAllDonationsController }
