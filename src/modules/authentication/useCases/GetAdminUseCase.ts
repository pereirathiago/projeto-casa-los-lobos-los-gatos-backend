import { NotFoundError } from '@shared/errors/index.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { IAdminResponseDTO } from '../dtos/IAdminDTO.js'
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js'

@injectable()
class GetAdminUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('UserRepository') private userRepository: IUserRepository,
  ) {}

  async execute(id: number): Promise<IAdminResponseDTO> {
    const admin = await this.userRepository.findById(id)

    if (!admin) {
      throw new NotFoundError('Admin not found')
    }

    if (admin.role !== 'admin') {
      throw new NotFoundError('Admin not found')
    }

    // Retornar dados do admin sem a senha
    const { password, ...adminResponse } = admin

    return adminResponse as IAdminResponseDTO
  }

  async executeAll(): Promise<IAdminResponseDTO[]> {
    const admins = await this.userRepository.findAllAdmins()

    // Retornar dados dos admins sem as senhas
    const adminsResponse = admins.map((admin) => {
      const { password, ...adminData } = admin
      return adminData as IAdminResponseDTO
    })

    return adminsResponse
  }
}

export { GetAdminUseCase }
