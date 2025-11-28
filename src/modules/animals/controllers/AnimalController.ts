import { ICreateAnimalDTO, IUpdateAnimalDTO } from '@modules/animals/dtos/IAnimalDTO.js'
import { AddAnimalPhotoUseCase } from '@modules/animals/useCases/AddAnimalPhotoUseCase.js'
import { CreateAnimalUseCase } from '@modules/animals/useCases/CreateAnimalUseCase.js'
import { DeleteAnimalPhotoUseCase } from '@modules/animals/useCases/DeleteAnimalPhotoUseCase.js'
import { DeleteAnimalUseCase } from '@modules/animals/useCases/DeleteAnimalUseCase.js'
import { GetAnimalUseCase } from '@modules/animals/useCases/GetAnimalUseCase.js'
import { UpdateAnimalInfoUseCase } from '@modules/animals/useCases/UpdateAnimalInfoUseCase.js'
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

  async getBySlug(req: Request, res: Response): Promise<Response> {
    const { slug } = req.params

    const getAnimalUseCase = container.resolve(GetAnimalUseCase)

    const animal = await getAnimalUseCase.executeBySlug(slug)

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

    const updateAnimalInfoUseCase = container.resolve(UpdateAnimalInfoUseCase)

    const animal = await updateAnimalInfoUseCase.execute(uuid, data)

    return res.status(200).json({
      message: 'Animal atualizado com sucesso',
      animal,
    })
  }

  async addPhoto(req: Request, res: Response): Promise<Response> {
    const { uuid } = req.params
    const file = req.file as Express.Multer.File

    const addAnimalPhotoUseCase = container.resolve(AddAnimalPhotoUseCase)

    const photo = await addAnimalPhotoUseCase.execute({
      animalUuid: uuid,
      file,
    })

    return res.status(201).json({
      message: 'Foto adicionada com sucesso',
      photo,
    })
  }

  async deletePhoto(req: Request, res: Response): Promise<Response> {
    const { uuid, photoUuid } = req.params

    const deleteAnimalPhotoUseCase = container.resolve(DeleteAnimalPhotoUseCase)

    await deleteAnimalPhotoUseCase.execute({
      animalUuid: uuid,
      photoUuid,
    })

    return res.status(200).json({
      message: 'Foto deletada com sucesso',
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
