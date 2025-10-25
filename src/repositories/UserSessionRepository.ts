import { injectable } from 'tsyringe'
import { db } from '../database/connection.js'
import { CreateUserSessionModel, UpdateUserSessionModel, UserSessionModel } from '../models/UserSessionModel.js'

export interface IUserSessionRepository {
  findById(id: string): Promise<UserSessionModel | null>
  findByRefreshToken(refreshToken: string): Promise<UserSessionModel | null>
  findActiveByUserId(userId: string): Promise<UserSessionModel[]>
  create(data: CreateUserSessionModel): Promise<UserSessionModel>
  update(id: string, data: UpdateUserSessionModel): Promise<UserSessionModel>
  delete(id: string): Promise<void>
  deleteByUserId(userId: string): Promise<void>
  deleteExpiredSessions(): Promise<void>
}

@injectable()
export class UserSessionRepository implements IUserSessionRepository {
  async findById(id: string): Promise<UserSessionModel | null> {
    const session = await db('user_sessions').where({ id }).first()
    return session || null
  }

  async findByRefreshToken(refreshToken: string): Promise<UserSessionModel | null> {
    const session = await db('user_sessions').where({ refresh_token: refreshToken, is_active: true }).first()
    return session || null
  }

  async findActiveByUserId(userId: string): Promise<UserSessionModel[]> {
    return db('user_sessions').where({ user_id: userId, is_active: true }).orderBy('created_at', 'desc')
  }

  async create(data: CreateUserSessionModel): Promise<UserSessionModel> {
    const [session] = await db('user_sessions').insert(data).returning('*')

    return session
  }

  async update(id: string, data: UpdateUserSessionModel): Promise<UserSessionModel> {
    const [session] = await db('user_sessions')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
      })
      .returning('*')

    return session
  }

  async delete(id: string): Promise<void> {
    await db('user_sessions').where({ id }).del()
  }

  async deleteByUserId(userId: string): Promise<void> {
    await db('user_sessions').where({ user_id: userId }).del()
  }

  async deleteExpiredSessions(): Promise<void> {
    await db('user_sessions').where('expires_date', '<', db.fn.now()).orWhere('is_active', false).del()
  }
}
