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
      message: 'Admin criado com sucesso!',
      admin,
    })
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    // Se não houver id nos params, usa o id do usuário logado (rota /me)
    const adminId = id ? Number(id) : req.user!.id

    const getAdminUseCase = container.resolve(GetAdminUseCase)

    const admin = await getAdminUseCase.execute(adminId)

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
    // Se não houver id nos params, usa o id do usuário logado (rota /me)
    const adminId = id ? Number(id) : req.user!.id

    const updateAdminUseCase = container.resolve(UpdateAdminUseCase)

    const admin = await updateAdminUseCase.execute(adminId, data)

    return res.status(200).json({
      message: 'Admin atualizado com sucesso!',
      admin,
    })
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const deleteAdminUseCase = container.resolve(DeleteAdminUseCase)

    await deleteAdminUseCase.execute(Number(id))

    return res.status(200).json({
      message: 'Admin deletado com sucesso!',
    })
  }
}

export { AdminController }
