import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { IConfirmDonationDTO } from '../dtos/IDonationDTO.js'
import { ConfirmDonationUseCase } from '../useCases/ConfirmDonationUseCase.js'

class ConfirmDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { uuid } = request.params
    const confirmedBy = request.user.id

    const data: IConfirmDonationDTO = {
      confirmedBy,
    }

    const confirmDonationUseCase = container.resolve(ConfirmDonationUseCase)
    await confirmDonationUseCase.execute(uuid, data)

    return response.status(204).send()
  }
}

export { ConfirmDonationController }
