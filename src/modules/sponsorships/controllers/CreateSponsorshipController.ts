import { Request, Response } from 'express'
import { container, injectable } from 'tsyringe'
import { CreateSponsorshipUseCase } from '../useCases/CreateSponsorshipUseCase.js'

@injectable()
export class CreateSponsorshipController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId, animalId, monthlyAmount } = request.body

    const createSponsorshipUseCase = container.resolve(CreateSponsorshipUseCase)
    const sponsorship = await createSponsorshipUseCase.execute({
      userUuid: userId,
      animalUuid: animalId,
      monthlyAmount,
    })

    return response.status(201).json(sponsorship)
  }
}
