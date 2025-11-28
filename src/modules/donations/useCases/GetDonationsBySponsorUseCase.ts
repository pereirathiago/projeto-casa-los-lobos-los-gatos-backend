import { inject, injectable } from 'tsyringe'

import { IMyDonationResponseDTO } from '../dtos/IDonationDTO.js'
import { IDonationWithDetailsModel } from '../models/IDonationModel.js'
import { IDonationRepository } from '../repositories/interfaces/IDonationRepository.js'

@injectable()
export class GetDonationsBySponsorUseCase {
  constructor(
    @inject('DonationRepository')
    private readonly donationRepository: IDonationRepository,
  ) {}

  async execute(userId: number): Promise<IMyDonationResponseDTO[]> {
    const donations = await this.donationRepository.findBySponsorIdWithDetails(userId)

    return donations.map(this.mapToMyDonationDTO)
  }

  private mapToMyDonationDTO(donation: IDonationWithDetailsModel): IMyDonationResponseDTO {
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
