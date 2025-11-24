import { inject, injectable } from 'tsyringe'
import { IMySponsorshipResponseDTO } from '../dtos/ISponsorshipDTO.js'
import { ISponsorshipRepository } from '../repositories/interfaces/ISponsorshipRepository.js'

@injectable()
class GetSponsorshipBySponsorUseCase {
  constructor(
    @inject('SponsorshipRepository')
    private sponsorshipRepository: ISponsorshipRepository,
  ) {}

  async execute(sponsorId: number): Promise<IMySponsorshipResponseDTO[]> {
    const sponsorships =
      await this.sponsorshipRepository.findAllByUserIdWithAnimalDetails(sponsorId)

    const sponsorshipsMap = new Map<number, IMySponsorshipResponseDTO>()

    sponsorships.forEach((sponsorship) => {
      if (!sponsorshipsMap.has(sponsorship.animal_id)) {
        sponsorshipsMap.set(sponsorship.animal_id, {
          uuid: sponsorship.sponsorship_uuid,
          animal: {
            uuid: sponsorship.animal_uuid,
            name: sponsorship.animal_name,
            type: sponsorship.animal_type,
            breed: sponsorship.animal_breed,
            age: sponsorship.animal_age,
            description: sponsorship.animal_description,
            photo: sponsorship.photo_url,
            tags: [],
          },
          active: sponsorship.active,
          sponsoredSince: sponsorship.sponsored_since,
        })
      }

      const current = sponsorshipsMap.get(sponsorship.animal_id)!
      if (sponsorship.tag_label && sponsorship.tag_color) {
        const tagExists = current.animal.tags.some(
          (tag) => tag.label === sponsorship.tag_label && tag.color === sponsorship.tag_color,
        )
        if (!tagExists) {
          current.animal.tags.push({
            label: sponsorship.tag_label,
            color: sponsorship.tag_color,
          })
        }
      }
    })

    return Array.from(sponsorshipsMap.values())
  }
}

export { GetSponsorshipBySponsorUseCase }
