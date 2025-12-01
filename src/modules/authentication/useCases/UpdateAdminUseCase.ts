import { BadRequestError, ConflictError, NotFoundError } from '@shared/errors/index.js'
import { hash } from 'bcrypt'
import type { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { IAdminResponseDTO, IUpdateAdminDTO } from '../dtos/IAdminDTO.js'
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js'

@injectable()
class UpdateAdminUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(id: number, data: IUpdateAdminDTO): Promise<IAdminResponseDTO> {
    const admin = await this.db.transaction(async (trx) => {
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

      if (adminExists.is_master && data.active === false) {
        throw new BadRequestError('Não é possível desativar o Admin Master')
      }

      // Se está atualizando o e-mail, verificar se já existe
      if (data.email && data.email !== adminExists.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email)) {
          throw new BadRequestError('Formato de e-mail inválido!')
        }

        const emailExists = await this.userRepository.findByEmail(data.email, trx)
        if (emailExists) {
          throw new ConflictError('Este e-mail já está em uso!')
        }
      }

      // Preparar dados para atualização
      const updateData: any = {}

      if (data.name) updateData.name = data.name
      if (data.email) updateData.email = data.email
      if (data.active !== undefined) updateData.active = data.active

      // Se está atualizando a senha, fazer hash
      if (data.password) {
        if (data.password.length < 6) {
          throw new BadRequestError('A senha deve ter pelo menos 6 caracteres!')
        }
        updateData.password = await hash(data.password, 8)
      }

      // Atualizar admin
      const updatedAdmin = await this.userRepository.update(id, updateData, trx)

      return updatedAdmin
    })

    // Retornar dados do admin sem a senha
    const { password, ...adminResponse } = admin

    return adminResponse as IAdminResponseDTO
  }
}

export { UpdateAdminUseCase }
