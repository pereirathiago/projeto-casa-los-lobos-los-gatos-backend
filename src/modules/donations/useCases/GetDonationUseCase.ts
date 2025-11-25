import { inject, injectable } from 'tsyringe'

import { AppError } from '../../../shared/errors/AppError.js'
import { IDonationResponseDTO } from '../dtos/IDonationDTO.js'
import { IDonationWithDetailsModel } from '../models/IDonationModel.js'
import { IDonationRepository } from '../repositories/interfaces/IDonationRepository.js'

@injectable()
export class GetDonationUseCase {
  constructor(
    @inject('DonationRepository')
    private readonly donationRepository: IDonationRepository,
  ) {}

  async execute(uuid: string): Promise<IDonationResponseDTO> {
    const donation = await this.donationRepository.findByUuidWithDetails(uuid)

    if (!donation) {
      throw new AppError('Donation not found', 404)
    }

    return this.mapToResponseDTO(donation)
  }

  private mapToResponseDTO(donation: IDonationWithDetailsModel): IDonationResponseDTO {
    return {
      uuid: donation.uuid,
      amount: donation.amount,
      donationDate: donation.donation_date,
      status: donation.status,
      notes: donation.notes,
      confirmedAt: donation.confirmed_at,
      createdAt: donation.created_at,
      user: {
        uuid: donation.user_uuid,
        name: donation.user_name,
        email: donation.user_email,
      },
      confirmedBy: donation.confirmed_by_uuid
        ? {
            uuid: donation.confirmed_by_uuid,
            name: donation.confirmed_by_name!,
          }
        : null,
    }
  }
}
