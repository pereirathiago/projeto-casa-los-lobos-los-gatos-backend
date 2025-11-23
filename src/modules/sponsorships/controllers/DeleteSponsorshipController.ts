import { Request, Response } from 'express'
import { container, injectable } from 'tsyringe'
import { DeleteSponsorshipUseCase } from '../useCases/DeleteSponsorshipUseCase.js'

@injectable()
export class DeleteSponsorshipController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { uuid } = request.params

    const deleteSponsorshipUseCase = container.resolve(DeleteSponsorshipUseCase)

    await deleteSponsorshipUseCase.execute({ uuid })

    return response.status(204).send()
  }
}
