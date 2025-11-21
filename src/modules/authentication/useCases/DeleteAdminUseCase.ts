import { ForbiddenError, NotFoundError } from '@shared/errors/index.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js'

@injectable()
class DeleteAdminUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<void> {
    await this.db.transaction(async (trx) => {
      // Verificar se o admin existe
      const adminExists = await this.userRepository.findById(id, trx)

      if (!adminExists) {
        throw new NotFoundError('Admin not found')
      }

      if (adminExists.role !== 'admin') {
        throw new NotFoundError('Admin not found')
      }

      if (adminExists.deleted) {
        throw new NotFoundError('Admin not found')
      }

      if (adminExists.is_master) {
        throw new ForbiddenError()
      }

      await this.userRepository.delete(id, trx)
    })
  }
}

export { DeleteAdminUseCase }
