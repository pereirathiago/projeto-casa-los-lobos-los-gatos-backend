import { NotFoundError } from '@shared/errors/http.js'
import { inject, injectable } from 'tsyringe'

import { IUserRepository } from '@modules/authentication/repositories/interfaces/IUserRepository.js'
import { ICreateDonationDTO } from '../dtos/IDonationDTO.js'
import { IDonationModel } from '../models/IDonationModel.js'
import { IDonationRepository } from '../repositories/interfaces/IDonationRepository.js'

@injectable()
export class CreateDonationUseCase {
  constructor(
    @inject('DonationRepository')
    private readonly donationRepository: IDonationRepository,
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: ICreateDonationDTO): Promise<IDonationModel> {
    // Buscar usuário pelo UUID
    const user = await this.userRepository.findByUuid(data.userUuid)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    // Criar doação com o ID interno do usuário
    const donation = await this.donationRepository.create({
      userId: user.id,
      amount: data.amount,
      donationDate: data.donationDate,
      notes: data.notes,
    })

    return donation
  }
}
