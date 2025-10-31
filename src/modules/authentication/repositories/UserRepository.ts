import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { IRegisterUserDTO } from '../dtos/IUserDTO.js'
import { IUserModel } from '../models/IUserModel.js'
import { IUserRepository } from './interfaces/IUserRepository.js'

@injectable()
class UserRepository implements IUserRepository {
  constructor(@inject('KnexConnection') private db: Knex) {}

  async create(userData: IRegisterUserDTO, trx?: Knex.Transaction): Promise<IUserModel> {
    const connection = trx || this.db

    const [user] = await connection<IUserModel>('users')
      .insert({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      })
      .returning('*')

    return user
  }

  async findByEmail(email: string, trx?: Knex.Transaction): Promise<IUserModel | null> {
    const connection = trx || this.db

    const user = await connection<IUserModel>('users').where({ email }).first()

    return user || null
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<IUserModel | null> {
    const connection = trx || this.db

    const user = await connection<IUserModel>('users').where({ id }).first()

    return user || null
  }
}

export { UserRepository }
