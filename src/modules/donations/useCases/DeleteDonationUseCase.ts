import { inject, injectable } from 'tsyringe'

import { AppError } from '../../../shared/errors/AppError.js'
import { IDonationRepository } from '../repositories/interfaces/IDonationRepository.js'

@injectable()
export class DeleteDonationUseCase {
  constructor(
    @inject('DonationRepository')
    private readonly donationRepository: IDonationRepository,
  ) {}

  async execute(uuid: string): Promise<void> {
    const donation = await this.donationRepository.findByUuid(uuid)

    if (!donation) {
      throw new AppError('Donation not found', 404)
    }

    await this.donationRepository.softDelete(uuid)
  }
}
