import { db } from '@shared/database/connection.js'
import { injectable } from 'tsyringe'
import { CreateUserModel, UpdateUserModel, UserModel } from '../models/UserModel.js'

export interface IUserRepository {
  findById(id: string): Promise<UserModel | null>
  findByEmail(email: string): Promise<UserModel | null>
  create(data: CreateUserModel): Promise<UserModel>
  update(id: string, data: UpdateUserModel): Promise<UserModel>
  delete(id: string): Promise<void>
  findAll(): Promise<UserModel[]>
}

@injectable()
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<UserModel | null> {
    const user = await db('users').where({ id }).first()
    return user || null
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const user = await db('users').where({ email }).first()
    return user || null
  }

  async create(data: CreateUserModel): Promise<UserModel> {
    const [user] = await db('users')
      .insert({
        ...data,
        role: data.role || 'user',
      })
      .returning('*')

    return user
  }

  async update(id: string, data: UpdateUserModel): Promise<UserModel> {
    const [user] = await db('users')
      .where({ id })
      .update({
        ...data,
        updated_at: db.fn.now(),
      })
      .returning('*')

    return user
  }

  async delete(id: string): Promise<void> {
    await db('users').where({ id }).del()
  }

  async findAll(): Promise<UserModel[]> {
    return db('users').select('*')
  }
}
