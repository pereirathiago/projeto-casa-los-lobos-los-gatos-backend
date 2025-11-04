import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { ICreateAdminDTO, IUpdateAdminDTO } from '../dtos/IAdminDTO.js'
import { CreateAdminUseCase } from '../useCases/CreateAdminUseCase.js'
import { DeleteAdminUseCase } from '../useCases/DeleteAdminUseCase.js'
import { GetAdminUseCase } from '../useCases/GetAdminUseCase.js'
import { UpdateAdminUseCase } from '../useCases/UpdateAdminUseCase.js'

class AdminController {
  async create(req: Request, res: Response): Promise<Response> {
    const data = req.body as ICreateAdminDTO

    const createAdminUseCase = container.resolve(CreateAdminUseCase)

    const admin = await createAdminUseCase.execute(data)

    return res.status(201).json({
      message: 'Admin created successfully!',
      admin,
    })
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const getAdminUseCase = container.resolve(GetAdminUseCase)

    const admin = await getAdminUseCase.execute(Number(id))

    return res.status(200).json(admin)
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const getAdminUseCase = container.resolve(GetAdminUseCase)

    const admins = await getAdminUseCase.executeAll()

    return res.status(200).json(admins)
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const data = req.body as IUpdateAdminDTO

    const updateAdminUseCase = container.resolve(UpdateAdminUseCase)

    const admin = await updateAdminUseCase.execute(Number(id), data)

    return res.status(200).json({
      message: 'Admin updated successfully!',
      admin,
    })
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const deleteAdminUseCase = container.resolve(DeleteAdminUseCase)

    await deleteAdminUseCase.execute(Number(id))

    return res.status(200).json({
      message: 'Admin deleted successfully!',
    })
  }
}

export { AdminController }
