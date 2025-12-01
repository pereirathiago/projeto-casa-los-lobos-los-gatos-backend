import { ForbiddenError, NotFoundError } from '@shared/errors/index.js'
import type { Knex } from 'knex'
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
        throw new NotFoundError('Admin não encontrado')
      }

      if (adminExists.role !== 'admin') {
        throw new NotFoundError('Admin não encontrado')
      }

      if (adminExists.deleted) {
        throw new NotFoundError('Admin não encontrado')
      }

      if (adminExists.is_master) {
        throw new ForbiddenError('Não é possível remover o admin master')
      }

      await this.userRepository.delete(id, trx)
    })
  }
}

export { DeleteAdminUseCase }
