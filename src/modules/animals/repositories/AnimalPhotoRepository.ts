import { IAnimalPhotoModel } from '@modules/animals/models/IAnimalPhotoModel.js'
import { IAnimalPhotoRepository } from '@modules/animals/repositories/interfaces/IAnimalPhotoRepository.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

@injectable()
class AnimalPhotoRepository implements IAnimalPhotoRepository {
  constructor(@inject('KnexConnection') private db: Knex) {}

  async create(
    animalId: number,
    photoUrl: string,
    orderIndex: number,
    trx?: Knex.Transaction,
  ): Promise<IAnimalPhotoModel> {
    const connection = trx || this.db

    const [photo] = await connection<IAnimalPhotoModel>('animal_photos')
      .insert({
        animal_id: animalId,
        photo_url: photoUrl,
        order_index: orderIndex,
      })
      .returning('*')

    return photo
  }

  async createMany(
    animalId: number,
    photos: Array<{ photoUrl: string; orderIndex: number }>,
    trx?: Knex.Transaction,
  ): Promise<IAnimalPhotoModel[]> {
    const connection = trx || this.db

    const photosToInsert = photos.map((photo) => ({
      animal_id: animalId,
      photo_url: photo.photoUrl,
      order_index: photo.orderIndex,
    }))

    const createdPhotos = await connection<IAnimalPhotoModel>('animal_photos')
      .insert(photosToInsert)
      .returning('*')

    return createdPhotos
  }

  async findByAnimalId(animalId: number, trx?: Knex.Transaction): Promise<IAnimalPhotoModel[]> {
    const connection = trx || this.db

    const photos = await connection<IAnimalPhotoModel>('animal_photos')
      .where({ animal_id: animalId })
      .orderBy('order_index', 'asc')

    return photos
  }

  async findByUuid(uuid: string, trx?: Knex.Transaction): Promise<IAnimalPhotoModel | null> {
    const connection = trx || this.db

    const photo = await connection<IAnimalPhotoModel>('animal_photos').where({ uuid }).first()

    return photo || null
  }

  async findByUuidAndAnimalId(
    uuid: string,
    animalId: number,
    trx?: Knex.Transaction,
  ): Promise<IAnimalPhotoModel | null> {
    const connection = trx || this.db

    const photo = await connection<IAnimalPhotoModel>('animal_photos')
      .where({ uuid, animal_id: animalId })
      .first()

    return photo || null
  }

  async deleteByAnimalId(animalId: number, trx?: Knex.Transaction): Promise<void> {
    const connection = trx || this.db

    await connection<IAnimalPhotoModel>('animal_photos').where({ animal_id: animalId }).delete()
  }

  async deleteByUuid(uuid: string, trx?: Knex.Transaction): Promise<void> {
    const connection = trx || this.db

    await connection<IAnimalPhotoModel>('animal_photos').where({ uuid }).delete()
  }

  async delete(id: number, trx?: Knex.Transaction): Promise<void> {
    const connection = trx || this.db

    await connection<IAnimalPhotoModel>('animal_photos').where({ id }).delete()
  }
}

export { AnimalPhotoRepository }
