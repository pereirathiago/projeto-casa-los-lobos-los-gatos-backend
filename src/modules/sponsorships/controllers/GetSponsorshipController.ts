import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { GetSponsorshipUseCase } from '../useCases/GetSponsorshipUseCase.js'

@injectable()
export class GetSponsorshipController {
  constructor(
    @inject('GetSponsorshipUseCase')
    private getSponsorshipUseCase: GetSponsorshipUseCase,
  ) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { uuid } = request.params

    if (!uuid) {
      return response.status(400).json({ message: 'UUID parameter is required' })
    }

    const sponsorship = await this.getSponsorshipUseCase.execute({ uuid })

    return response.status(200).json(sponsorship)
  }
}
