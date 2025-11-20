import { ICreateAnimalDTO, IUpdateAnimalDTO } from '@modules/animals/dtos/IAnimalDTO.js'
import { CreateAnimalUseCase } from '@modules/animals/useCases/CreateAnimalUseCase.js'
import { DeleteAnimalUseCase } from '@modules/animals/useCases/DeleteAnimalUseCase.js'
import { GetAnimalUseCase } from '@modules/animals/useCases/GetAnimalUseCase.js'
import { UpdateAnimalUseCase } from '@modules/animals/useCases/UpdateAnimalUseCase.js'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class AnimalController {
  async create(req: Request, res: Response): Promise<Response> {
    const data = req.body as ICreateAnimalDTO
    const files = req.files as Express.Multer.File[]

    const createAnimalUseCase = container.resolve(CreateAnimalUseCase)

    const animal = await createAnimalUseCase.execute({ ...data, files })

    return res.status(201).json({
      message: 'Animal cadastrado com sucesso',
      animal,
    })
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { uuid } = req.params

    const getAnimalUseCase = container.resolve(GetAnimalUseCase)

    const animal = await getAnimalUseCase.execute(uuid)

    return res.status(200).json(animal)
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    const { type, breed, minAge, maxAge } = req.query

    const filters: any = {}

    if (type) filters.type = type as 'dog' | 'cat'
    if (breed) filters.breed = breed as string
    if (minAge) filters.minAge = parseFloat(minAge as string)
    if (maxAge) filters.maxAge = parseFloat(maxAge as string)

    const getAnimalUseCase = container.resolve(GetAnimalUseCase)

    const animals = await getAnimalUseCase.executeAll(filters)

    return res.status(200).json(animals)
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { uuid } = req.params
    const data = req.body as IUpdateAnimalDTO
    const files = req.files as Express.Multer.File[] | undefined

    const updateAnimalUseCase = container.resolve(UpdateAnimalUseCase)

    const animal = await updateAnimalUseCase.execute(uuid, {
      ...data,
      files,
    })

    return res.status(200).json({
      message: 'Animal atualizado com sucesso',
      animal,
    })
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { uuid } = req.params

    const deleteAnimalUseCase = container.resolve(DeleteAnimalUseCase)

    await deleteAnimalUseCase.execute(uuid)

    return res.status(200).json({
      message: 'Animal deletado com sucesso',
    })
  }
}

export { AnimalController }
