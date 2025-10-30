import { Knex } from 'knex'
import { IRegisterUserDTO } from '../../dtos/IUserDTO.js'
import { IUserModel } from '../../models/IUserModel.js'

interface IUserRepository {
  create(userData: IRegisterUserDTO, trx?: Knex.Transaction): Promise<IUserModel>
  findByEmail(email: string, trx?: Knex.Transaction): Promise<IUserModel | null>
  findById(id: number, trx?: Knex.Transaction): Promise<IUserModel | null>
}

export { IUserRepository }
