import { IAnimalPhotoRepository } from '@modules/animals/repositories/interfaces/IAnimalPhotoRepository.js'
import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { NotFoundError } from '@shared/errors/index.js'
import { IStorageProvider } from '@src/shared/container/providers/storage-provider/i-storage-provider.js'
import type { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

interface IDeleteAnimalPhotoRequest {
  animalUuid: string
  photoUuid: string
}

@injectable()
class DeleteAnimalPhotoUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('AnimalRepository') private animalRepository: IAnimalRepository,
    @inject('AnimalPhotoRepository') private animalPhotoRepository: IAnimalPhotoRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  async execute({ animalUuid, photoUuid }: IDeleteAnimalPhotoRequest): Promise<void> {
    const animal = await this.animalRepository.findByUuid(animalUuid)

    if (!animal) {
      throw new NotFoundError('Animal não encontrado')
    }

    const photo = await this.animalPhotoRepository.findByUuidAndAnimalId(photoUuid, animal.id)

    if (!photo) {
      throw new NotFoundError('Foto não encontrada ou não pertence a este animal')
    }

    await this.db.transaction(async (trx) => {
      await this.animalPhotoRepository.deleteByUuid(photoUuid, trx)

      await this.storageProvider.delete(photo.photo_url, 'animals')

      const remainingPhotos = await this.animalPhotoRepository.findByAnimalId(animal.id, trx)

      for (let i = 0; i < remainingPhotos.length; i++) {
        if (remainingPhotos[i].order_index !== i) {
          await trx('animal_photos').where({ id: remainingPhotos[i].id }).update({ order_index: i })
        }
      }
    })
  }
}

export { DeleteAnimalPhotoUseCase }
