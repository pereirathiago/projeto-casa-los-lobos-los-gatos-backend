import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICreateDonationDTO } from '../dtos/IDonationDTO.js'
import { CreateDonationUseCase } from '../useCases/CreateDonationUseCase.js'

class CreateDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { amount, donationDate, notes } = request.body
    const userId = request.user.id

    const data: ICreateDonationDTO = {
      userId,
      amount: parseFloat(amount),
      donationDate: new Date(donationDate),
      notes,
    }

    const createDonationUseCase = container.resolve(CreateDonationUseCase)
    const donation = await createDonationUseCase.execute(data)

    return response.status(201).json(donation)
  }
}

export { CreateDonationController }
