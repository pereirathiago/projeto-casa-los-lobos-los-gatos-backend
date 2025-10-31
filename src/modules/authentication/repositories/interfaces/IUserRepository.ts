import { IRegisterUserDTO } from '@modules/authentication/dtos/IUserDTO.js'
import { IUserModel } from '@modules/authentication/models/IUserModel.js'
import { Knex } from 'knex'

interface IUserRepository {
  create(userData: IRegisterUserDTO, trx?: Knex.Transaction): Promise<IUserModel>
  findByEmail(email: string, trx?: Knex.Transaction): Promise<IUserModel | null>
  findById(id: string, trx?: Knex.Transaction): Promise<IUserModel | null>
}

export { IUserRepository }
