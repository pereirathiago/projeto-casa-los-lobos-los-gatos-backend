import { IAdminDashboardDTO, ISponsorDashboardDTO } from '../../dtos/IDashboardDTO.js'

interface IDashboardRepository {
  getAdminDashboard(): Promise<IAdminDashboardDTO>
  getSponsorDashboard(userId: number): Promise<ISponsorDashboardDTO>
}

export { IDashboardRepository }
