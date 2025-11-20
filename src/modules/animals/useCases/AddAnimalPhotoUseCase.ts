import { IAnimalPhotoDTO } from '@modules/animals/dtos/IAnimalDTO.js'
import { IAnimalPhotoRepository } from '@modules/animals/repositories/interfaces/IAnimalPhotoRepository.js'
import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { NotFoundError, ValidationError } from '@shared/errors/index.js'
import { IStorageProvider } from '@src/shared/container/providers/storage-provider/i-storage-provider.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

interface IAddAnimalPhotoRequest {
  animalUuid: string
  file: Express.Multer.File
}

@injectable()
class AddAnimalPhotoUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('AnimalRepository') private animalRepository: IAnimalRepository,
    @inject('AnimalPhotoRepository') private animalPhotoRepository: IAnimalPhotoRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  async execute({ animalUuid, file }: IAddAnimalPhotoRequest): Promise<IAnimalPhotoDTO> {
    const animal = await this.animalRepository.findByUuid(animalUuid)

    if (!animal) {
      throw new NotFoundError('Animal não encontrado')
    }

    const existingPhotos = await this.animalPhotoRepository.findByAnimalId(animal.id)

    if (existingPhotos.length >= 3) {
      throw new ValidationError([
        {
          field: 'arquivo',
          message: 'Limite máximo de 3 fotos atingido. Remova uma foto antes de adicionar outra.',
        },
      ])
    }

    const photo = await this.db.transaction(async (trx) => {
      await this.storageProvider.save(file.filename, 'animals')

      const orderIndex = existingPhotos.length
      const newPhoto = await this.animalPhotoRepository.create(
        animal.id,
        file.filename,
        orderIndex,
        trx,
      )

      if (existingPhotos.length === 0) {
        await this.animalRepository.update(
          animal.id,
          {
            photo_url: newPhoto.photo_url,
          },
          trx,
        )
      }

      return newPhoto
    })

    return {
      id: photo.id,
      uuid: photo.uuid,
      animal_id: photo.animal_id,
      photo_url: `${this.storageProvider.url}/animals/${photo.photo_url}`,
      order_index: photo.order_index,
      created_at: photo.created_at,
    }
  }
}

export { AddAnimalPhotoUseCase }
