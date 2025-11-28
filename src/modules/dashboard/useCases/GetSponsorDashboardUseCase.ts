import { inject, injectable } from 'tsyringe'

import { ISponsorDashboardDTO } from '../dtos/IDashboardDTO.js'
import { IDashboardRepository } from '../repositories/interfaces/IDashboardRepository.js'

@injectable()
export class GetSponsorDashboardUseCase {
  constructor(
    @inject('DashboardRepository')
    private readonly dashboardRepository: IDashboardRepository,
  ) {}

  async execute(userId: number): Promise<ISponsorDashboardDTO> {
    const dashboard = await this.dashboardRepository.getSponsorDashboard(userId)

    return dashboard
  }
}
