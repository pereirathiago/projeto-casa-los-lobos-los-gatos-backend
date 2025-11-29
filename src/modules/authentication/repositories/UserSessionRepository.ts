import type { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { ICreateUserSessionDTO } from '../dtos/IUserSessionDTO.js'
import { UserSessionModel } from '../models/IUserSessionModel.js'
import { IUserSessionRepository } from './interfaces/IUserSessionRepository.js'

@injectable()
class UserSessionRepository implements IUserSessionRepository {
  constructor(@inject('KnexConnection') private db: Knex) {}

  async create(
    sessionData: ICreateUserSessionDTO,
    trx?: Knex.Transaction,
  ): Promise<UserSessionModel> {
    const connection = trx || this.db

    const [session] = await connection<UserSessionModel>('user_sessions')
      .insert({
        user_id: sessionData.user_id,
        refresh_token: sessionData.refresh_token,
        expires_date: sessionData.expires_date,
        is_active: true,
      })
      .returning('*')

    return session
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<UserSessionModel | null> {
    const connection = trx || this.db

    const session = await connection<UserSessionModel>('user_sessions')
      .where({ id, is_active: true })
      .first()

    return session || null
  }

  async findByRefreshToken(
    refreshToken: string,
    trx?: Knex.Transaction,
  ): Promise<UserSessionModel | null> {
    const connection = trx || this.db

    const session = await connection<UserSessionModel>('user_sessions')
      .where({ refresh_token: refreshToken, is_active: true })
      .first()

    return session || null
  }

  async findActiveByUserId(userId: number, trx?: Knex.Transaction): Promise<UserSessionModel[]> {
    const connection = trx || this.db

    const sessions = await connection<UserSessionModel>('user_sessions')
      .where({ user_id: userId, is_active: true })
      .where('expires_date', '>', connection.fn.now())
      .orderBy('created_at', 'desc')

    return sessions
  }

  async invalidateById(id: string, trx?: Knex.Transaction): Promise<boolean> {
    const connection = trx || this.db

    const updatedCount = await connection('user_sessions')
      .where({ id, is_active: true })
      .update({ is_active: false, updated_at: connection.fn.now() })

    return updatedCount > 0
  }

  async invalidateByUserId(userId: number, trx?: Knex.Transaction): Promise<void> {
    const connection = trx || this.db

    await connection('user_sessions')
      .where({ user_id: userId, is_active: true })
      .update({ is_active: false, updated_at: connection.fn.now() })
  }

  async deleteById(id: string, trx?: Knex.Transaction): Promise<void> {
    const connection = trx || this.db

    await connection('user_sessions').where({ id }).del()
  }

  async deleteExpiredSessions(trx?: Knex.Transaction): Promise<void> {
    const connection = trx || this.db

    await connection('user_sessions')
      .where('expires_date', '<', connection.fn.now())
      .orWhere('is_active', false)
      .del()
  }
}

export { UserSessionRepository }
