import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetAllSponsorsUseCase } from '../useCases/GetAllSponsorsUseCase.js'

class GetAllSponsorsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const getAllSponsorsUseCase = container.resolve(GetAllSponsorsUseCase)

    const sponsors = await getAllSponsorsUseCase.execute()

    return res.status(200).json(sponsors)
  }
}

export { GetAllSponsorsController }
