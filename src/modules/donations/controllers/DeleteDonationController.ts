import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { DeleteDonationUseCase } from '../useCases/DeleteDonationUseCase.js'

class DeleteDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { uuid } = request.params

    const deleteDonationUseCase = container.resolve(DeleteDonationUseCase)
    await deleteDonationUseCase.execute(uuid)

    return response.status(204).send()
  }
}

export { DeleteDonationController }
