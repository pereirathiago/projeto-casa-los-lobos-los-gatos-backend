import { Request, Response } from 'express'
import { container, injectable } from 'tsyringe'
import { GetSponsorshipUseCase } from '../useCases/GetSponsorshipUseCase.js'

@injectable()
export class GetSponsorshipController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { uuid } = request.params

    if (!uuid) {
      return response.status(400).json({ message: 'Parâmetro UUID é obrigatório' })
    }

    const getSponsorshipUseCase = container.resolve(GetSponsorshipUseCase)

    const sponsorship = await getSponsorshipUseCase.execute({ uuid })

    return response.status(200).json(sponsorship)
  }
}
