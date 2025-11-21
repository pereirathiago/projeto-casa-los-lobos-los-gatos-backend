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
        is_master: false,
      })
      .returning('*')

    return user
  }

  async findByEmail(email: string, trx?: Knex.Transaction): Promise<IUserModel | null> {
    const connection = trx || this.db

    const user = await connection<IUserModel>('users').where({ email, active: true }).first()

    return user || null
  }

  async findById(id: number, trx?: Knex.Transaction): Promise<IUserModel | null> {
    const connection = trx || this.db

    const user = await connection<IUserModel>('users').where({ id, active: true }).first()

    return user || null
  }

  async findByUuid(uuid: string, trx?: Knex.Transaction): Promise<IUserModel | null> {
    const connection = trx || this.db

    const user = await connection<IUserModel>('users').where({ uuid, active: true }).first()

    return user || null
  }

  async update(
    id: number,
    userData: Partial<IUserModel>,
    trx?: Knex.Transaction,
  ): Promise<IUserModel> {
    const connection = trx || this.db

    const [user] = await connection<IUserModel>('users')
      .where({ id })
      .update({
        ...userData,
        updated_at: connection.fn.now(),
      })
      .returning('*')

    return user
  }

  async delete(id: number, trx?: Knex.Transaction): Promise<void> {
    const connection = trx || this.db

    await connection<IUserModel>('users').where({ id }).update({
      active: false,
      updated_at: connection.fn.now(),
    })
  }

  async findAll(trx?: Knex.Transaction): Promise<IUserModel[]> {
    const connection = trx || this.db

    const users = await connection<IUserModel>('users').select('*')

    return users
  }

  async findAllAdmins(trx?: Knex.Transaction): Promise<IUserModel[]> {
    const connection = trx || this.db

    const admins = await connection<IUserModel>('users').where({ role: 'admin' }).select('*')

    return admins
  }
}

export { UserRepository }
