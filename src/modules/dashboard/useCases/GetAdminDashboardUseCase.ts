import { inject, injectable } from 'tsyringe'

import { IAdminDashboardDTO } from '../dtos/IDashboardDTO.js'
import { IDashboardRepository } from '../repositories/interfaces/IDashboardRepository.js'

@injectable()
class GetAdminDashboardUseCase {
  constructor(
    @inject('DashboardRepository')
    private readonly dashboardRepository: IDashboardRepository,
  ) {}

  async execute(): Promise<IAdminDashboardDTO> {
    const dashboard = await this.dashboardRepository.getAdminDashboard()
    return dashboard
  }
}

export { GetAdminDashboardUseCase }
