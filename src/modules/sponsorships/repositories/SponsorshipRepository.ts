import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { ICreateSponsorshipDTO } from '../dtos/ISponsorshipDTO.js'
import { ISponsorshipModel } from '../models/ISponsorshipModel.js'
import { ISponsorshipRepository } from './interfaces/ISponsorshipRepository.js'

@injectable()
export class SponsorshipRepository implements ISponsorshipRepository {
  constructor(@inject('KnexConnection') private db: Knex) {}

  async create(data: ICreateSponsorshipDTO): Promise<ISponsorshipModel> {
    const [sponsorship] = await this.db<ISponsorshipModel>('sponsorships')
      .insert({
        user_id: data.userId,
        animal_id: data.animalId,
        active: true,
      })
      .returning('*')
    return sponsorship
  }

  async findByUserAndAnimal(
    userId: number,
    animalId: number,
  ): Promise<ISponsorshipModel | undefined> {
    const sponsorship = await this.db<ISponsorshipModel>('sponsorships')
      .where({ user_id: userId, animal_id: animalId, deleted: false })
      .first()
    return sponsorship
  }
}
