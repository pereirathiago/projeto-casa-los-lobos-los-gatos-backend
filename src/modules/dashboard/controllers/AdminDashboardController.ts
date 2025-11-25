import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetAdminDashboardUseCase } from '../useCases/GetAdminDashboardUseCase.js'

class AdminDashboardController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getAdminDashboardUseCase = container.resolve(GetAdminDashboardUseCase)
    const dashboard = await getAdminDashboardUseCase.execute()

    return response.json(dashboard)
  }
}

export { AdminDashboardController }
