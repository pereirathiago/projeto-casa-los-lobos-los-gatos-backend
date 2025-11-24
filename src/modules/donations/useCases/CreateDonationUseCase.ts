import { inject, injectable } from 'tsyringe'

import { ICreateDonationDTO } from '../dtos/IDonationDTO.js'
import { IDonationModel } from '../models/IDonationModel.js'
import { IDonationRepository } from '../repositories/interfaces/IDonationRepository.js'

@injectable()
export class CreateDonationUseCase {
  constructor(
    @inject('DonationRepository')
    private readonly donationRepository: IDonationRepository,
  ) {}

  async execute(data: ICreateDonationDTO): Promise<IDonationModel> {
    const donation = await this.donationRepository.create(data)
    return donation
  }
}
