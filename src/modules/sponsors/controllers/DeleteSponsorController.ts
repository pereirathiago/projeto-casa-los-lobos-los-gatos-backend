import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { DeleteSponsorUseCase } from '../useCases/DeleteSponsorUseCase.js'

class DeleteSponsorController {
  async handle(req: Request, res: Response): Promise<Response> {
    const requestingUserUuid = req.user!.uuid!

    const deleteSponsorUseCase = container.resolve(DeleteSponsorUseCase)

    await deleteSponsorUseCase.execute(requestingUserUuid, requestingUserUuid)

    return res.status(200).json({
      message: 'Sponsor deleted successfully!',
    })
  }
}

export { DeleteSponsorController }
