import { inject, injectable } from 'tsyringe'

import { IDonationResponseDTO } from '../dtos/IDonationDTO.js'
import { IDonationWithDetailsModel } from '../models/IDonationModel.js'
import { IDonationRepository } from '../repositories/interfaces/IDonationRepository.js'

@injectable()
export class GetAllDonationsUseCase {
  constructor(
    @inject('DonationRepository')
    private readonly donationRepository: IDonationRepository,
  ) {}

  async execute(): Promise<IDonationResponseDTO[]> {
    const donations = await this.donationRepository.findAllWithDetails()

    return donations.map(this.mapToResponseDTO)
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
