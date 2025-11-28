import { Request, Response } from 'express'
import { container, injectable } from 'tsyringe'
import { UpdateSponsorshipUseCase } from '../useCases/UpdateSponsorshipUseCase.js'

@injectable()
export class UpdateSponsorshipController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { uuid } = request.params
    const { animalId, monthlyAmount, active } = request.body

    const updateSponsorshipUseCase = container.resolve(UpdateSponsorshipUseCase)
    const sponsorship = await updateSponsorshipUseCase.execute({
      uuid,
      animalUuid: animalId,
      monthlyAmount,
      active,
    })

    return response.status(200).json(sponsorship)
  }
}
