import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { ISponsorResponseDTO } from '../dtos/ISponsorDTO.js'
import { ISponsorRepository } from '../repositories/interfaces/ISponsorRepository.js'

@injectable()
class GetAllSponsorsUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('SponsorRepository') private sponsorRepository: ISponsorRepository,
  ) {}

  async execute(): Promise<ISponsorResponseDTO[]> {
    const sponsors = await this.sponsorRepository.findAllSponsors()

    const sponsorsResponse = sponsors.map((sponsor) => {
      const { password, id, ...sponsorData } = sponsor
      return sponsorData as ISponsorResponseDTO
    })

    return sponsorsResponse
  }
}

export { GetAllSponsorsUseCase }
