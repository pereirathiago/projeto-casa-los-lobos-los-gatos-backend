import { ICreateUserSessionDTO } from '@modules/authentication/dtos/IUserSessionDTO.js'
import { UserSessionModel } from '@modules/authentication/models/IUserSessionModel.js'
import type { Knex } from 'knex'

interface IUserSessionRepository {
  create(sessionData: ICreateUserSessionDTO, trx?: Knex.Transaction): Promise<UserSessionModel>
  findById(id: string, trx?: Knex.Transaction): Promise<UserSessionModel | null>
  findByRefreshToken(refreshToken: string, trx?: Knex.Transaction): Promise<UserSessionModel | null>
  findActiveByUserId(userId: number, trx?: Knex.Transaction): Promise<UserSessionModel[]>
  invalidateById(id: string, trx?: Knex.Transaction): Promise<boolean>
  invalidateByUserId(userId: number, trx?: Knex.Transaction): Promise<void>
  deleteById(id: string, trx?: Knex.Transaction): Promise<void>
  deleteExpiredSessions(trx?: Knex.Transaction): Promise<void>
}

export { IUserSessionRepository }
