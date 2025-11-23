import { IUserModel } from '@modules/authentication/models/IUserModel.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { ISponsorSearchResult } from '../dtos/ISponsorDTO.js'
import { ISponsorRepository } from './interfaces/ISponsorRepository.js'

@injectable()
class SponsorRepository implements ISponsorRepository {
  constructor(@inject('KnexConnection') private db: Knex) {}

  async findAllSponsors(trx?: Knex.Transaction): Promise<IUserModel[]> {
    const connection = trx || this.db

    const sponsors = await connection<IUserModel>('users')
      .where({ role: 'sponsor', deleted: false, active: true })
      .select('*')

    return sponsors
  }

  async findSponsorByUuid(uuid: string, trx?: Knex.Transaction): Promise<IUserModel | null> {
    const connection = trx || this.db

    const sponsor = await connection<IUserModel>('users')
      .where({ uuid, role: 'sponsor', deleted: false, active: true })
      .first()

    return sponsor || null
  }

  async searchSponsorsByEmail(
    email: string,
    trx?: Knex.Transaction,
  ): Promise<ISponsorSearchResult> {
    const connection = trx || this.db

    const sponsor = await connection<IUserModel>('users')
      .where({ email, role: 'sponsor', deleted: false, active: true })
      .select('uuid', 'name', 'email')
      .first()

    return sponsor
  }
}

export { SponsorRepository }
