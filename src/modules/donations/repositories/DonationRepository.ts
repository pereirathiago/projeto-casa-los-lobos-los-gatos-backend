import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

import { ICreateDonationDTO } from '../dtos/IDonationDTO.js'
import { IDonationModel, IDonationWithDetailsModel } from '../models/IDonationModel.js'
import { IDonationRepository } from './interfaces/IDonationRepository.js'

@injectable()
export class DonationRepository implements IDonationRepository {
  constructor(
    @inject('KnexConnection')
    private readonly knex: Knex,
  ) {}

  async create(data: ICreateDonationDTO): Promise<IDonationModel> {
    const [donation] = await this.knex('donations')
      .insert({
        user_id: data.userId,
        amount: data.amount,
        donation_date: data.donationDate,
        notes: data.notes || null,
        status: 'pending',
        confirmed_by: null,
        confirmed_at: null,
        deleted: false,
      })
      .returning('*')

    return donation
  }

  async findAll(): Promise<IDonationModel[]> {
    const donations = await this.knex('donations')
      .where('deleted', false)
      .orderBy('created_at', 'desc')

    return donations
  }

  async findAllWithDetails(): Promise<IDonationWithDetailsModel[]> {
    const donations = await this.knex('donations')
      .select(
        'donations.uuid',
        'donations.amount',
        'donations.donation_date',
        'donations.status',
        'donations.notes',
        'donations.confirmed_at',
        'donations.created_at',
        'users.uuid as user_uuid',
        'users.name as user_name',
        'users.email as user_email',
        'confirmedByUser.uuid as confirmed_by_uuid',
        'confirmedByUser.name as confirmed_by_name',
      )
      .innerJoin('users', 'donations.user_id', 'users.id')
      .leftJoin('users as confirmedByUser', 'donations.confirmed_by', 'confirmedByUser.id')
      .where('donations.deleted', false)
      .orderBy('donations.created_at', 'desc')

    return donations
  }

  async findByUuid(uuid: string): Promise<IDonationModel | null> {
    const donation = await this.knex('donations').where({ uuid, deleted: false }).first()

    return donation || null
  }

  async findByUuidWithDetails(uuid: string): Promise<IDonationWithDetailsModel | null> {
    const donation = await this.knex('donations')
      .select(
        'donations.uuid',
        'donations.amount',
        'donations.donation_date',
        'donations.status',
        'donations.notes',
        'donations.confirmed_at',
        'donations.created_at',
        'users.uuid as user_uuid',
        'users.name as user_name',
        'users.email as user_email',
        'confirmedByUser.uuid as confirmed_by_uuid',
        'confirmedByUser.name as confirmed_by_name',
      )
      .innerJoin('users', 'donations.user_id', 'users.id')
      .leftJoin('users as confirmedByUser', 'donations.confirmed_by', 'confirmedByUser.id')
      .where('donations.uuid', uuid)
      .andWhere('donations.deleted', false)
      .first()

    return donation || null
  }

  async findBySponsorId(userId: number): Promise<IDonationModel[]> {
    const donations = await this.knex('donations')
      .where({ user_id: userId, deleted: false })
      .orderBy('created_at', 'desc')

    return donations
  }

  async findBySponsorIdWithDetails(userId: number): Promise<IDonationWithDetailsModel[]> {
    const donations = await this.knex('donations')
      .select(
        'donations.uuid',
        'donations.amount',
        'donations.donation_date',
        'donations.status',
        'donations.notes',
        'donations.confirmed_at',
        'donations.created_at',
        'users.uuid as user_uuid',
        'users.name as user_name',
        'users.email as user_email',
        'confirmedByUser.uuid as confirmed_by_uuid',
        'confirmedByUser.name as confirmed_by_name',
      )
      .innerJoin('users', 'donations.user_id', 'users.id')
      .leftJoin('users as confirmedByUser', 'donations.confirmed_by', 'confirmedByUser.id')
      .where('donations.user_id', userId)
      .andWhere('donations.deleted', false)
      .orderBy('donations.created_at', 'desc')

    return donations
  }

  async confirmDonation(uuid: string, confirmedBy: number, confirmedAt: Date): Promise<void> {
    await this.knex('donations').where({ uuid }).update({
      status: 'confirmed',
      confirmed_by: confirmedBy,
      confirmed_at: confirmedAt,
      updated_at: this.knex.fn.now(),
    })
  }

  async softDelete(uuid: string): Promise<void> {
    await this.knex('donations').where({ uuid }).update({
      deleted: true,
      updated_at: this.knex.fn.now(),
    })
  }
}
