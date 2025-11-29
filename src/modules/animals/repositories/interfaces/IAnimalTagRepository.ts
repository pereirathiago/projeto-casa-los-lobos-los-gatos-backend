import { IAnimalTagModel } from '@modules/animals/models/IAnimalTagModel.js'
import type { Knex } from 'knex'

interface IAnimalTagRepository {
  create(
    animalId: number,
    label: string,
    color: string,
    trx?: Knex.Transaction,
  ): Promise<IAnimalTagModel>
  createMany(
    animalId: number,
    tags: Array<{ label: string; color: string }>,
    trx?: Knex.Transaction,
  ): Promise<IAnimalTagModel[]>
  findByAnimalId(animalId: number, trx?: Knex.Transaction): Promise<IAnimalTagModel[]>
  deleteByAnimalId(animalId: number, trx?: Knex.Transaction): Promise<void>
  delete(id: number, trx?: Knex.Transaction): Promise<void>
}

export { IAnimalTagRepository }
