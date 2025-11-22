import { IUserModel } from '@modules/authentication/models/IUserModel.js'
import { Knex } from 'knex'

interface ISponsorRepository {
  findAllSponsors(trx?: Knex.Transaction): Promise<IUserModel[]>
  findSponsorByUuid(uuid: string, trx?: Knex.Transaction): Promise<IUserModel | null>
}

export { ISponsorRepository }
