import { ForbiddenError, NotFoundError } from '@shared/errors/index.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { ISponsorResponseDTO } from '../dtos/ISponsorDTO.js'
import { ISponsorRepository } from '../repositories/interfaces/ISponsorRepository.js'

@injectable()
class GetSponsorUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('SponsorRepository') private sponsorRepository: ISponsorRepository,
  ) {}

  async execute(uuid: string, requestingUserUuid: string): Promise<ISponsorResponseDTO> {
    if (uuid !== requestingUserUuid) {
      throw new ForbiddenError()
    }

    const sponsor = await this.sponsorRepository.findSponsorByUuid(uuid)

    if (!sponsor) {
      throw new NotFoundError('Sponsor not found')
    }

    if (sponsor.deleted) {
      throw new NotFoundError('Sponsor not found')
    }

    const { password, id, ...sponsorResponse } = sponsor

    return sponsorResponse as ISponsorResponseDTO
  }
}

export { GetSponsorUseCase }
