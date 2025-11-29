import { IUserRepository } from '@modules/authentication/repositories/interfaces/IUserRepository.js'
import { ForbiddenError, NotFoundError } from '@shared/errors/index.js'
import type { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { ISponsorRepository } from '../repositories/interfaces/ISponsorRepository.js'

@injectable()
class DeleteSponsorUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('SponsorRepository') private sponsorRepository: ISponsorRepository,
  ) {}

  async execute(uuid: string, requestingUserUuid: string): Promise<void> {
    if (uuid !== requestingUserUuid) {
      throw new ForbiddenError()
    }

    await this.db.transaction(async (trx) => {
      const sponsorExists = await this.sponsorRepository.findSponsorByUuid(uuid, trx)

      if (!sponsorExists) {
        throw new NotFoundError('Sponsor not found')
      }

      if (sponsorExists.deleted) {
        throw new NotFoundError('Sponsor not found')
      }

      await this.userRepository.delete(sponsorExists.id, trx)
    })
  }
}

export { DeleteSponsorUseCase }
