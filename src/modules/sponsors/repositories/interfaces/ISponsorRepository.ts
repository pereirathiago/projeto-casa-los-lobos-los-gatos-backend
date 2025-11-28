import { IUserModel } from '@modules/authentication/models/IUserModel.js'
import { Knex } from 'knex'
import { ISponsorSearchResult } from '../../dtos/ISponsorDTO.js'

interface ISponsorRepository {
  findAllSponsors(trx?: Knex.Transaction): Promise<IUserModel[]>
  findSponsorByUuid(uuid: string, trx?: Knex.Transaction): Promise<IUserModel | null>
  searchSponsorsByEmail(email: string, trx?: Knex.Transaction): Promise<ISponsorSearchResult>
}

export { ISponsorRepository }
