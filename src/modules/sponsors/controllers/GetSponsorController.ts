import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { GetSponsorUseCase } from '../useCases/GetSponsorUseCase.js'

class GetSponsorController {
  async handle(req: Request, res: Response): Promise<Response> {
    const requestingUserUuid = req.user!.uuid!

    const getSponsorUseCase = container.resolve(GetSponsorUseCase)

    const sponsor = await getSponsorUseCase.execute(requestingUserUuid, requestingUserUuid)

    return res.status(200).json(sponsor)
  }
}

export { GetSponsorController }
