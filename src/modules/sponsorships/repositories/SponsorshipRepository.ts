import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { ICreateSponsorshipDTO, IUpdateSponsorshipDTO } from '../dtos/ISponsorshipDTO.js'
import { ISponsorshipModel, ISponsorshipWithDetailsModel } from '../models/ISponsorshipModel.js'
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

  async findAll(): Promise<ISponsorshipModel[]> {
    const sponsorships = await this.db<ISponsorshipModel>('sponsorships')
      .where({ deleted: false })
      .orderBy('created_at', 'desc')
    return sponsorships
  }

  async findAllWithDetails(): Promise<ISponsorshipWithDetailsModel[]> {
    const sponsorships = await this.db('sponsorships')
      .select(
        'sponsorships.uuid',
        'sponsorships.active',
        'sponsorships.created_at',
        'sponsorships.updated_at',
        'users.uuid as user_uuid',
        'users.name as user_name',
        'users.email as user_email',
        'animals.uuid as animal_uuid',
        'animals.name as animal_name',
        'animals.type as animal_type',
        'animals.breed as animal_breed',
      )
      .innerJoin('users', 'sponsorships.user_id', 'users.id')
      .innerJoin('animals', 'sponsorships.animal_id', 'animals.id')
      .where('sponsorships.deleted', false)
      .orderBy('sponsorships.created_at', 'desc')

    return sponsorships as ISponsorshipWithDetailsModel[]
  }

  async findByUuid(uuid: string): Promise<ISponsorshipModel | undefined> {
    const sponsorship = await this.db<ISponsorshipModel>('sponsorships')
      .where({ uuid, deleted: false })
      .first()
    return sponsorship
  }

  async findByUuidWithDetails(uuid: string): Promise<ISponsorshipWithDetailsModel | undefined> {
    const sponsorship = await this.db('sponsorships')
      .select(
        'sponsorships.uuid',
        'sponsorships.active',
        'sponsorships.created_at',
        'sponsorships.updated_at',
        'users.uuid as user_uuid',
        'users.name as user_name',
        'users.email as user_email',
        'animals.uuid as animal_uuid',
        'animals.name as animal_name',
        'animals.type as animal_type',
        'animals.breed as animal_breed',
      )
      .innerJoin('users', 'sponsorships.user_id', 'users.id')
      .innerJoin('animals', 'sponsorships.animal_id', 'animals.id')
      .where('sponsorships.uuid', uuid)
      .andWhere('sponsorships.deleted', false)
      .first()

    return sponsorship as ISponsorshipWithDetailsModel | undefined
  }

  async findById(id: number): Promise<ISponsorshipModel | undefined> {
    const sponsorship = await this.db<ISponsorshipModel>('sponsorships').where({ id }).first()
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

  async update(id: number, data: IUpdateSponsorshipDTO): Promise<ISponsorshipModel> {
    const [sponsorship] = await this.db<ISponsorshipModel>('sponsorships')
      .where({ id })
      .update({
        animal_id: data.animalId,
        active: data.active,
      })
      .returning('*')
    return sponsorship
  }

  async softDelete(id: number): Promise<void> {
    await this.db<ISponsorshipModel>('sponsorships').where({ id }).update({ deleted: true })
  }
}
