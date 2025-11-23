import { NotFoundError } from '@shared/errors/http.js'
import { inject, injectable } from 'tsyringe'
import { ISponsorshipResponseDTO } from '../dtos/ISponsorshipDTO.js'
import { ISponsorshipRepository } from '../repositories/interfaces/ISponsorshipRepository.js'

interface IRequest {
  uuid: string
}

@injectable()
export class GetSponsorshipUseCase {
  constructor(
    @inject('SponsorshipRepository')
    private sponsorshipRepository: ISponsorshipRepository,
  ) {}

  async execute({ uuid }: IRequest): Promise<ISponsorshipResponseDTO> {
    const sponsorship = await this.sponsorshipRepository.findByUuidWithDetails(uuid)

    if (!sponsorship) {
      throw new NotFoundError('Sponsorship not found')
    }

    return {
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
      active: sponsorship.active,
      date: sponsorship.created_at,
    }
  }
}
