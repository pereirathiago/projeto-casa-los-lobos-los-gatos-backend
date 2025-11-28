import { ICreateAnimalDTO } from '@modules/animals/dtos/IAnimalDTO.js'
import { IAnimalModel } from '@modules/animals/models/IAnimalModel.js'
import { Knex } from 'knex'

interface IAnimalRepository {
  create(animalData: ICreateAnimalDTO, trx?: Knex.Transaction): Promise<IAnimalModel>
  findById(id: number, trx?: Knex.Transaction): Promise<IAnimalModel | null>
  findByUuid(uuid: string, trx?: Knex.Transaction): Promise<IAnimalModel | null>
  findAll(
    filters?: {
      type?: 'dog' | 'cat'
      breed?: string
      minAge?: number
      maxAge?: number
    },
    trx?: Knex.Transaction,
  ): Promise<IAnimalModel[]>
  searchByName(name: string, trx?: Knex.Transaction): Promise<IAnimalModel[]>
  update(
    id: number,
    animalData: Partial<IAnimalModel>,
    trx?: Knex.Transaction,
  ): Promise<IAnimalModel>
  delete(id: number, trx?: Knex.Transaction): Promise<void>
}

export { IAnimalRepository }
