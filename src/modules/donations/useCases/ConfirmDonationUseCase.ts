import { inject, injectable } from 'tsyringe'

import { AppError } from '../../../shared/errors/AppError.js'
import { IConfirmDonationDTO } from '../dtos/IDonationDTO.js'
import { IDonationRepository } from '../repositories/interfaces/IDonationRepository.js'

@injectable()
export class ConfirmDonationUseCase {
  constructor(
    @inject('DonationRepository')
    private readonly donationRepository: IDonationRepository,
  ) {}

  async execute(uuid: string, data: IConfirmDonationDTO): Promise<void> {
    const donation = await this.donationRepository.findByUuid(uuid)

    if (!donation) {
      throw new AppError('Donation not found', 404)
    }

    if (donation.status === 'confirmed') {
      throw new AppError('Donation already confirmed', 400)
    }

    const confirmedAt = new Date()
    await this.donationRepository.confirmDonation(uuid, data.confirmedBy, confirmedAt)
  }
}
