import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { ICreateDonationDTO } from '../dtos/IDonationDTO.js'
import { CreateDonationUseCase } from '../useCases/CreateDonationUseCase.js'
import { ForbiddenError } from '@src/shared/errors/http.js'

class CreateDonationController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { userId: userUuid, amount, donationDate, notes } = request.body
    const authenticatedUser = request.user!

    // Apenas admins podem especificar userId de outro usuário
    // Padrinhos só podem criar doações para si mesmos
    let targetUserId: string

    if (userUuid && userUuid !== authenticatedUser.uuid) {
      // Tentou especificar outro usuário - só admin pode fazer isso
      if (authenticatedUser.role !== 'admin') {
        throw new ForbiddenError('Sem permissão para criar doação a outro usuário')
      }
      targetUserId = userUuid
    } else {
      // Usa o ID do usuário autenticado
      targetUserId = authenticatedUser.uuid
    }

    const data: ICreateDonationDTO = {
      userUuid: targetUserId,
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
