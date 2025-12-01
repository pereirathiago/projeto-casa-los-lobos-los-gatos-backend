import { ForbiddenError, NotFoundError } from '@shared/errors/index.js'
import type { Knex } from 'knex'
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
      throw new ForbiddenError('Sem permissão para acessar este padrinho')
    }

    const sponsor = await this.sponsorRepository.findSponsorByUuid(uuid)

    if (!sponsor) {
      throw new NotFoundError('Padrinho não encontrado')
    }

    if (sponsor.deleted) {
      throw new NotFoundError('Padrinho não encontrado')
    }

    const { password, id, ...sponsorResponse } = sponsor

    return sponsorResponse as ISponsorResponseDTO
  }
}

export { GetSponsorUseCase }
