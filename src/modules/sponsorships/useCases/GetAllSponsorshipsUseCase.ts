import { inject, injectable } from 'tsyringe'
import { ISponsorshipResponseDTO } from '../dtos/ISponsorshipDTO.js'
import { ISponsorshipRepository } from '../repositories/interfaces/ISponsorshipRepository.js'

@injectable()
export class GetAllSponsorshipsUseCase {
  constructor(
    @inject('SponsorshipRepository')
    private sponsorshipRepository: ISponsorshipRepository,
  ) {}

  async execute(): Promise<ISponsorshipResponseDTO[]> {
    const sponsorships = await this.sponsorshipRepository.findAllWithDetails()

    return sponsorships.map((sponsorship) => ({
      uuid: sponsorship.uuid,
      user: {
        uuid: sponsorship.user_uuid,
        name: sponsorship.user_name,
        email: sponsorship.user_email,
      },
      animal: {
        uuid: sponsorship.animal_uuid,
        name: sponsorship.animal_name,
        type: sponsorship.animal_type,
        breed: sponsorship.animal_breed,
      },
      monthlyAmount: sponsorship.monthly_amount,
      active: sponsorship.active,
      date: sponsorship.created_at,
    }))
  }
}
