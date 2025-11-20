import { IAnimalPhotoModel } from '@modules/animals/models/IAnimalPhotoModel.js'
import { Knex } from 'knex'

interface IAnimalPhotoRepository {
  create(
    animalId: number,
    photoUrl: string,
    orderIndex: number,
    trx?: Knex.Transaction,
  ): Promise<IAnimalPhotoModel>
  createMany(
    animalId: number,
    photos: Array<{ photoUrl: string; orderIndex: number }>,
    trx?: Knex.Transaction,
  ): Promise<IAnimalPhotoModel[]>
  findByAnimalId(animalId: number, trx?: Knex.Transaction): Promise<IAnimalPhotoModel[]>
  findByUuid(uuid: string, trx?: Knex.Transaction): Promise<IAnimalPhotoModel | null>
  findByUuidAndAnimalId(
    uuid: string,
    animalId: number,
    trx?: Knex.Transaction,
  ): Promise<IAnimalPhotoModel | null>
  deleteByAnimalId(animalId: number, trx?: Knex.Transaction): Promise<void>
  deleteByUuid(uuid: string, trx?: Knex.Transaction): Promise<void>
  delete(id: number, trx?: Knex.Transaction): Promise<void>
}

export { IAnimalPhotoRepository }
