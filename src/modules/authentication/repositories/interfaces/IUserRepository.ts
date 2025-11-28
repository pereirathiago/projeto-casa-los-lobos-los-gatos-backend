import { IRegisterUserDTO } from '@modules/authentication/dtos/IUserDTO.js'
import { IUserModel } from '@modules/authentication/models/IUserModel.js'
import { Knex } from 'knex'

interface IUserRepository {
  create(userData: IRegisterUserDTO, trx?: Knex.Transaction): Promise<IUserModel>
  findByEmail(email: string, trx?: Knex.Transaction): Promise<IUserModel | null>
  findById(id: number, trx?: Knex.Transaction): Promise<IUserModel | null>
  findByUuid(uuid: string, trx?: Knex.Transaction): Promise<IUserModel | null>
  update(id: number, userData: Partial<IUserModel>, trx?: Knex.Transaction): Promise<IUserModel>
  delete(id: number, trx?: Knex.Transaction): Promise<void>
  findAll(trx?: Knex.Transaction): Promise<IUserModel[]>
  findAllAdmins(trx?: Knex.Transaction): Promise<IUserModel[]>
}

export { IUserRepository }
