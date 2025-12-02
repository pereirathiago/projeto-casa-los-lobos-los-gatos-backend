import { inject, injectable } from 'tsyringe'

import { IMyDonationResponseDTO } from '../dtos/IDonationDTO.js'
import { IDonationRepository } from '../repositories/interfaces/IDonationRepository.js'
import { AppError } from '@shared/errors/AppError.js'

@injectable()
export class GetMyDonationUseCase {
  constructor(
    @inject('DonationRepository')
    private readonly donationRepository: IDonationRepository,
  ) {}

  async execute(uuid: string, userId: number): Promise<IMyDonationResponseDTO> {
    const donation = await this.donationRepository.findByUuid(uuid)

    if (!donation) {
      throw new AppError('Doação não encontrada', 404)
    }

    if (donation.user_id !== userId) {
      throw new AppError('Você não tem permissão para visualizar esta doação', 403)
    }

    return {
      uuid: donation.uuid,
      amount: donation.amount,
      donationDate: donation.donation_date,
      status: donation.status,
      notes: donation.notes,
      confirmedAt: donation.confirmed_at,
      createdAt: donation.created_at,
    }
  }
}
