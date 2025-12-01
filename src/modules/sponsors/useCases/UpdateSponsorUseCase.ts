import { IUserRepository } from '@modules/authentication/repositories/interfaces/IUserRepository.js'
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '@shared/errors/index.js'
import { hash } from 'bcrypt'
import type { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { ISponsorResponseDTO, IUpdateSponsorDTO } from '../dtos/ISponsorDTO.js'
import { ISponsorRepository } from '../repositories/interfaces/ISponsorRepository.js'

@injectable()
class UpdateSponsorUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('SponsorRepository') private sponsorRepository: ISponsorRepository,
  ) {}

  async execute(
    uuid: string,
    data: IUpdateSponsorDTO,
    requestingUserUuid: string,
  ): Promise<ISponsorResponseDTO> {
    if (uuid !== requestingUserUuid) {
      throw new ForbiddenError('Sem permissão para atualizar este padrinho')
    }

    const sponsor = await this.db.transaction(async (trx) => {
      const sponsorExists = await this.sponsorRepository.findSponsorByUuid(uuid, trx)

      if (!sponsorExists) {
        throw new NotFoundError('Padrinho não encontrado')
      }

      if (sponsorExists.deleted) {
        throw new NotFoundError('Padrinho não encontrado')
      }

      if (data.email && data.email !== sponsorExists.email) {
        const emailExists = await this.userRepository.findByEmail(data.email, trx)
        if (emailExists) {
          throw new ConflictError('Email já está em uso!')
        }
      }

      const updateData: any = {}

      if (data.name) updateData.name = data.name
      if (data.email) updateData.email = data.email
      if (data.active !== undefined) updateData.active = data.active

      if (data.password) {
        if (data.password.length < 6) {
          throw new BadRequestError('A senha deve ter pelo menos 6 caracteres!')
        }
        updateData.password = await hash(data.password, 8)
      }

      const updatedSponsor = await this.userRepository.update(sponsorExists.id, updateData, trx)

      return updatedSponsor
    })

    const { password, id, ...sponsorResponse } = sponsor

    return sponsorResponse as ISponsorResponseDTO
  }
}

export { UpdateSponsorUseCase }
