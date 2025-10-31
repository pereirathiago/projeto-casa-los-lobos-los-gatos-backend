import { ICreateUserSessionDTO } from '@modules/authentication/dtos/IUserSessionDTO.js'
import { UserSessionModel } from '@modules/authentication/models/IUserSessionModel.js'
import { Knex } from 'knex'

interface IUserSessionRepository {
  create(sessionData: ICreateUserSessionDTO, trx?: Knex.Transaction): Promise<UserSessionModel>
  findByRefreshToken(refreshToken: string, trx?: Knex.Transaction): Promise<UserSessionModel | null>
  findActiveByUserId(userId: string, trx?: Knex.Transaction): Promise<UserSessionModel[]>
  deleteByRefreshToken(refreshToken: string, trx?: Knex.Transaction): Promise<boolean>
  deleteByUserId(userId: string, trx?: Knex.Transaction): Promise<void>
  deleteExpiredSessions(trx?: Knex.Transaction): Promise<void>
}

export { IUserSessionRepository }
