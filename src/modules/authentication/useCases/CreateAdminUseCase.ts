import { BadRequestError, ConflictError } from '@shared/errors/index.js'
import { hash } from 'bcrypt'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { ICreateAdminDTO, IAdminResponseDTO } from '../dtos/IAdminDTO.js'
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
      throw new BadRequestError('Name, email and password are required!')
    }

    // Validação de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      throw new BadRequestError('Invalid email format!')
    }

    // Validação de senha (mínimo 6 caracteres)
    if (data.password.length < 6) {
      throw new BadRequestError('Password must be at least 6 characters long!')
    }

    const admin = await this.db.transaction(async (trx) => {
      // Verificar se o e-mail já existe
      const userExists = await this.userRepository.findByEmail(data.email, trx)

      if (userExists) {
        throw new ConflictError('Email already in use!')
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
