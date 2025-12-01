import { BadRequestError, ConflictError } from '@shared/errors/index.js'
import { hash } from 'bcrypt'
import type { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { IAdminResponseDTO, ICreateAdminDTO } from '../dtos/IAdminDTO.js'
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js'

@injectable()
class CreateAdminUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(data: ICreateAdminDTO): Promise<IAdminResponseDTO> {
    // Validação de dados de entrada
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestError('Nome, email e senha são obrigatórios!')
    }

    // Validação de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      throw new BadRequestError('Formato de email inválido!')
    }

    // Validação de senha (mínimo 6 caracteres)
    if (data.password.length < 6) {
      throw new BadRequestError('A senha deve ter pelo menos 6 caracteres!')
    }

    const admin = await this.db.transaction(async (trx) => {
      // Verificar se o e-mail já existe
      const userExists = await this.userRepository.findByEmail(data.email, trx)

      if (userExists) {
        throw new ConflictError('Este email já está em uso!')
      }

      // Hash da senha
      const hashedPassword = await hash(data.password, 8)

      // Criar admin
      const newAdmin = await this.userRepository.create(
        {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: 'admin',
        },
        trx,
      )

      return newAdmin
    })

    // Retornar dados do admin sem a senha
    const { password, ...adminResponse } = admin

    return adminResponse as IAdminResponseDTO
  }
}

export { CreateAdminUseCase }
