import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'
import { ICreateSponsorshipDTO, IUpdateSponsorshipDTO } from '../dtos/ISponsorshipDTO.js'
import {
  ISponsorshipModel,
  ISponsorshipWithAnimalDetailsModel,
  ISponsorshipWithDetailsModel,
} from '../models/ISponsorshipModel.js'
import { ISponsorshipRepository } from './interfaces/ISponsorshipRepository.js'

@injectable()
export class SponsorshipRepository implements ISponsorshipRepository {
  constructor(@inject('KnexConnection') private db: Knex) {}

  async create(data: ICreateSponsorshipDTO): Promise<ISponsorshipModel> {
    const [sponsorship] = await this.db<ISponsorshipModel>('sponsorships')
      .insert({
        user_id: data.userId,
        animal_id: data.animalId,
        monthly_amount: data.monthlyAmount,
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
        'sponsorships.monthly_amount',
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
        'sponsorships.monthly_amount',
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

  async findAllByUserId(userId: number): Promise<ISponsorshipWithDetailsModel[]> {
    const sponsorships = await this.db<ISponsorshipModel>()
      .from('sponsorships as s')
      .select(
        's.uuid',
        's.active',
        's.created_at',
        's.updated_at',
        'u.uuid as user_uuid',
        'u.name as user_name',
        'u.email as user_email',
        'a.uuid as animal_uuid',
        'a.name as animal_name',
        'a.type as animal_type',
        'a.breed as animal_breed',
      )
      .innerJoin('users as u', 's.user_id', 'u.id')
      .innerJoin('animals as a', 's.animal_id', 'a.id')
      .where('s.user_id', userId)
      .andWhere('s.deleted', false)

    return sponsorships
  }

  async findAllByUserIdWithAnimalDetails(
    userId: number,
  ): Promise<ISponsorshipWithAnimalDetailsModel[]> {
    const sponsorships = await this.db('sponsorships as s')
      .select(
        's.uuid as sponsorship_uuid',
        's.active',
        's.created_at as sponsored_since',
        'a.id as animal_id',
        'a.uuid as animal_uuid',
        'a.name as animal_name',
        'a.type as animal_type',
        'a.breed as animal_breed',
        'a.age as animal_age',
        'a.description as animal_description',
        'ap.photo_url',
        'at.label as tag_label',
        'at.color as tag_color',
      )
      .innerJoin('animals as a', 's.animal_id', 'a.id')
      .leftJoin('animal_photos as ap', function () {
        this.on('a.id', '=', 'ap.animal_id').andOnVal('ap.order_index', '=', 0)
      })
      .leftJoin('animal_tags as at', 'a.id', 'at.animal_id')
      .where('s.user_id', userId)
      .andWhere('s.deleted', false)
      .andWhere('a.active', true)
      .orderBy('s.created_at', 'desc')

    return sponsorships as ISponsorshipWithAnimalDetailsModel[]
  }

  async update(id: number, data: IUpdateSponsorshipDTO): Promise<ISponsorshipModel> {
    const updateData: any = {}

    if (data.animalId !== undefined) updateData.animal_id = data.animalId
    if (data.monthlyAmount !== undefined) updateData.monthly_amount = data.monthlyAmount
    if (data.active !== undefined) updateData.active = data.active

    const [sponsorship] = await this.db<ISponsorshipModel>('sponsorships')
      .where({ id })
      .update(updateData)
      .returning('*')
    return sponsorship
  }

  async softDelete(id: number): Promise<void> {
    await this.db<ISponsorshipModel>('sponsorships').where({ id }).update({ deleted: true })
  }
}
