import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IUpdateSponsorDTO } from '../dtos/ISponsorDTO.js'
import { UpdateSponsorUseCase } from '../useCases/UpdateSponsorUseCase.js'

class UpdateSponsorController {
  async handle(req: Request, res: Response): Promise<Response> {
    const data = req.body as IUpdateSponsorDTO
    const requestingUserUuid = req.user!.uuid!

    const updateSponsorUseCase = container.resolve(UpdateSponsorUseCase)

    const sponsor = await updateSponsorUseCase.execute(requestingUserUuid, data, requestingUserUuid)

    return res.status(200).json({
      message: 'Sponsor updated successfully!',
      sponsor,
    })
  }
}

export { UpdateSponsorController }
