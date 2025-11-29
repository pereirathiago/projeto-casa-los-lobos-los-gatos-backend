import type { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

import { IAdminDashboardDTO, ISponsorDashboardDTO } from '../dtos/IDashboardDTO.js'
import { IDashboardRepository } from './interfaces/IDashboardRepository.js'

@injectable()
class DashboardRepository implements IDashboardRepository {
  constructor(
    @inject('KnexConnection')
    private readonly knex: Knex,
  ) {}

  async getAdminDashboard(): Promise<IAdminDashboardDTO> {
    const animalsStats = (await this.knex('animals')
      .select(
        this.knex.raw('COUNT(*) as total'),
        this.knex.raw('SUM(CASE WHEN active = true THEN 1 ELSE 0 END) as active'),
      )
      .first()) as unknown as { total: string; active: string } | undefined

    const sponsorsStats = (await this.knex('users')
      .select(
        this.knex.raw('COUNT(*) as total'),
        this.knex.raw(
          'SUM(CASE WHEN active = true AND deleted = false THEN 1 ELSE 0 END) as active',
        ),
        this.knex.raw('SUM(CASE WHEN deleted = true THEN 1 ELSE 0 END) as deleted'),
      )
      .where('role', 'sponsor')
      .first()) as unknown as { total: string; active: string; deleted: string } | undefined

    const sponsorshipsStats = (await this.knex('sponsorships')
      .count('* as total_active')
      .where({ active: true, deleted: false })
      .first()) as unknown as { total_active: number } | undefined

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const [donationsGeneral, donationsDay, donationsWeek, donationsMonth, donationsYear] =
      await Promise.all([
        this.knex('donations')
          .select(
            this.knex.raw('COUNT(*) as count'),
            this.knex.raw('COALESCE(SUM(amount), 0) as total'),
            this.knex.raw('COALESCE(AVG(amount), 0) as average'),
          )
          .where({ status: 'confirmed', deleted: false })
          .first() as unknown as Promise<
          { count: string; total: string; average: string } | undefined
        >,

        this.knex('donations')
          .select(
            this.knex.raw('COUNT(*) as count'),
            this.knex.raw('COALESCE(SUM(amount), 0) as total'),
            this.knex.raw('COALESCE(AVG(amount), 0) as average'),
          )
          .where({ status: 'confirmed', deleted: false })
          .andWhere('donation_date', '>=', startOfDay)
          .first() as unknown as Promise<
          { count: string; total: string; average: string } | undefined
        >,

        this.knex('donations')
          .select(
            this.knex.raw('COUNT(*) as count'),
            this.knex.raw('COALESCE(SUM(amount), 0) as total'),
            this.knex.raw('COALESCE(AVG(amount), 0) as average'),
          )
          .where({ status: 'confirmed', deleted: false })
          .andWhere('donation_date', '>=', startOfWeek)
          .first() as unknown as Promise<
          { count: string; total: string; average: string } | undefined
        >,

        this.knex('donations')
          .select(
            this.knex.raw('COUNT(*) as count'),
            this.knex.raw('COALESCE(SUM(amount), 0) as total'),
            this.knex.raw('COALESCE(AVG(amount), 0) as average'),
          )
          .where({ status: 'confirmed', deleted: false })
          .andWhere('donation_date', '>=', startOfMonth)
          .first() as unknown as Promise<
          { count: string; total: string; average: string } | undefined
        >,

        this.knex('donations')
          .select(
            this.knex.raw('COUNT(*) as count'),
            this.knex.raw('COALESCE(SUM(amount), 0) as total'),
            this.knex.raw('COALESCE(AVG(amount), 0) as average'),
          )
          .where({ status: 'confirmed', deleted: false })
          .andWhere('donation_date', '>=', startOfYear)
          .first() as unknown as Promise<
          { count: string; total: string; average: string } | undefined
        >,
      ])

    const topAnimals = await this.knex('sponsorships')
      .select(
        'animals.uuid',
        'animals.name',
        'animals.type',
        this.knex.raw('COUNT(sponsorships.id) as sponsorship_count'),
      )
      .innerJoin('animals', 'sponsorships.animal_id', 'animals.id')
      .where({ 'sponsorships.active': true, 'sponsorships.deleted': false })
      .groupBy('animals.id', 'animals.uuid', 'animals.name', 'animals.type')
      .orderBy('sponsorship_count', 'desc')
      .limit(5)

    const topSponsors = await this.knex('donations')
      .select(
        'users.uuid',
        'users.name',
        'users.email',
        this.knex.raw('COALESCE(SUM(donations.amount), 0) as total_donations'),
      )
      .innerJoin('users', 'donations.user_id', 'users.id')
      .where({ 'donations.status': 'confirmed', 'donations.deleted': false })
      .groupBy('users.id', 'users.uuid', 'users.name', 'users.email')
      .orderBy('total_donations', 'desc')
      .limit(5)

    return {
      animals: {
        total: Number(animalsStats?.total || 0),
        active: Number(animalsStats?.active || 0),
      },
      sponsors: {
        total: Number(sponsorsStats?.total || 0),
        active: Number(sponsorsStats?.active || 0),
        deleted: Number(sponsorsStats?.deleted || 0),
      },
      sponsorships: {
        totalActive: Number(sponsorshipsStats?.total_active || 0),
      },
      donations: {
        total: Number(donationsGeneral?.count || 0),
        thisMonth: Number(donationsMonth?.count || 0),
        general: {
          total: Number(donationsGeneral?.total || 0),
          average: Number(donationsGeneral?.average || 0),
        },
        day: {
          total: Number(donationsDay?.total || 0),
          average: Number(donationsDay?.average || 0),
        },
        week: {
          total: Number(donationsWeek?.total || 0),
          average: Number(donationsWeek?.average || 0),
        },
        month: {
          total: Number(donationsMonth?.total || 0),
          average: Number(donationsMonth?.average || 0),
        },
        year: {
          total: Number(donationsYear?.total || 0),
          average: Number(donationsYear?.average || 0),
        },
      },
      topAnimals: topAnimals.map((animal) => ({
        uuid: animal.uuid,
        name: animal.name,
        type: animal.type,
        sponsorshipCount: Number(animal.sponsorship_count),
      })),
      topSponsors: topSponsors.map((sponsor) => ({
        uuid: sponsor.uuid,
        name: sponsor.name,
        email: sponsor.email,
        totalDonations: Number(sponsor.total_donations),
      })),
    }
  }

  async getSponsorDashboard(userId: number): Promise<ISponsorDashboardDTO> {
    const godchildrenStats = (await this.knex('sponsorships')
      .count('* as total')
      .where({ user_id: userId, active: true, deleted: false })
      .first()) as unknown as { total: number } | undefined

    const firstSponsorship = await this.knex('sponsorships')
      .select('created_at')
      .where({ user_id: userId, active: true, deleted: false })
      .orderBy('created_at', 'asc')
      .first()

    let monthsAsSponsor = 0
    if (firstSponsorship) {
      const now = new Date()
      const firstDate = new Date(firstSponsorship.created_at)
      const yearsDiff = now.getFullYear() - firstDate.getFullYear()
      const monthsDiff = now.getMonth() - firstDate.getMonth()
      monthsAsSponsor = yearsDiff * 12 + monthsDiff
    }

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const [donationsGeneral, donationsDay, donationsWeek, donationsMonth, donationsYear] =
      await Promise.all([
        this.knex('donations')
          .select(
            this.knex.raw('COUNT(*) as count'),
            this.knex.raw('COALESCE(SUM(amount), 0) as total'),
            this.knex.raw('COALESCE(AVG(amount), 0) as average'),
          )
          .where({ user_id: userId, status: 'confirmed', deleted: false })
          .first() as unknown as Promise<
          { count: string; total: string; average: string } | undefined
        >,

        this.knex('donations')
          .select(
            this.knex.raw('COUNT(*) as count'),
            this.knex.raw('COALESCE(SUM(amount), 0) as total'),
            this.knex.raw('COALESCE(AVG(amount), 0) as average'),
          )
          .where({ user_id: userId, status: 'confirmed', deleted: false })
          .andWhere('donation_date', '>=', startOfDay)
          .first() as unknown as Promise<
          { count: string; total: string; average: string } | undefined
        >,

        this.knex('donations')
          .select(
            this.knex.raw('COUNT(*) as count'),
            this.knex.raw('COALESCE(SUM(amount), 0) as total'),
            this.knex.raw('COALESCE(AVG(amount), 0) as average'),
          )
          .where({ user_id: userId, status: 'confirmed', deleted: false })
          .andWhere('donation_date', '>=', startOfWeek)
          .first() as unknown as Promise<
          { count: string; total: string; average: string } | undefined
        >,

        this.knex('donations')
          .select(
            this.knex.raw('COUNT(*) as count'),
            this.knex.raw('COALESCE(SUM(amount), 0) as total'),
            this.knex.raw('COALESCE(AVG(amount), 0) as average'),
          )
          .where({ user_id: userId, status: 'confirmed', deleted: false })
          .andWhere('donation_date', '>=', startOfMonth)
          .first() as unknown as Promise<
          { count: string; total: string; average: string } | undefined
        >,

        this.knex('donations')
          .select(
            this.knex.raw('COUNT(*) as count'),
            this.knex.raw('COALESCE(SUM(amount), 0) as total'),
            this.knex.raw('COALESCE(AVG(amount), 0) as average'),
          )
          .where({ user_id: userId, status: 'confirmed', deleted: false })
          .andWhere('donation_date', '>=', startOfYear)
          .first() as unknown as Promise<
          { count: string; total: string; average: string } | undefined
        >,
      ])

    const totalSponsorshipsEver = (await this.knex('sponsorships')
      .count('* as total')
      .where({ user_id: userId, deleted: false })
      .first()) as unknown as { total: number } | undefined

    return {
      godchildren: {
        total: Number(godchildrenStats?.total || 0),
      },
      contributions: {
        total: Number(donationsGeneral?.total || 0),
      },
      monthsAsSponsor,
      donations: {
        general: {
          total: Number(donationsGeneral?.total || 0),
          average: Number(donationsGeneral?.average || 0),
        },
        day: {
          total: Number(donationsDay?.total || 0),
          average: Number(donationsDay?.average || 0),
        },
        week: {
          total: Number(donationsWeek?.total || 0),
          average: Number(donationsWeek?.average || 0),
        },
        month: {
          total: Number(donationsMonth?.total || 0),
          average: Number(donationsMonth?.average || 0),
        },
        year: {
          total: Number(donationsYear?.total || 0),
          average: Number(donationsYear?.average || 0),
        },
      },
      history: {
        firstSponsorshipDate: firstSponsorship?.created_at || new Date(),
        totalSponsorshipsEver: Number(totalSponsorshipsEver?.total || 0),
      },
    }
  }
}

export { DashboardRepository }
