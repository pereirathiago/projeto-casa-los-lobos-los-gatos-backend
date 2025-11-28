import { IUserRepository } from '@modules/authentication/repositories/interfaces/IUserRepository.js'
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from '@shared/errors/index.js'
import { hash } from 'bcrypt'
import { Knex } from 'knex'
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
      throw new ForbiddenError()
    }

    const sponsor = await this.db.transaction(async (trx) => {
      const sponsorExists = await this.sponsorRepository.findSponsorByUuid(uuid, trx)

      if (!sponsorExists) {
        throw new NotFoundError('Sponsor not found')
      }

      if (sponsorExists.deleted) {
        throw new NotFoundError('Sponsor not found')
      }

      if (data.email && data.email !== sponsorExists.email) {
        const emailExists = await this.userRepository.findByEmail(data.email, trx)
        if (emailExists) {
          throw new ConflictError('Email already in use!')
        }
      }

      const updateData: any = {}

      if (data.name) updateData.name = data.name
      if (data.email) updateData.email = data.email
      if (data.active !== undefined) updateData.active = data.active

      if (data.password) {
        if (data.password.length < 6) {
          throw new BadRequestError('Password must be at least 6 characters long!')
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
