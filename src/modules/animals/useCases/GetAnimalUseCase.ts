import { IAnimalResponseDTO } from '@modules/animals/dtos/IAnimalDTO.js'
import { IAnimalPhotoRepository } from '@modules/animals/repositories/interfaces/IAnimalPhotoRepository.js'
import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { IAnimalTagRepository } from '@modules/animals/repositories/interfaces/IAnimalTagRepository.js'
import { NotFoundError } from '@shared/errors/index.js'
import { IStorageProvider } from '@src/shared/container/providers/storage-provider/i-storage-provider.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

@injectable()
class GetAnimalUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('AnimalRepository') private animalRepository: IAnimalRepository,
    @inject('AnimalPhotoRepository') private animalPhotoRepository: IAnimalPhotoRepository,
    @inject('AnimalTagRepository') private animalTagRepository: IAnimalTagRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  async execute(uuid: string): Promise<IAnimalResponseDTO> {
    const animal = await this.animalRepository.findByUuid(uuid)

    if (!animal) {
      throw new NotFoundError('Animal não encontrado')
    }

    const photos = await this.animalPhotoRepository.findByAnimalId(animal.id)

    const tags = await this.animalTagRepository.findByAnimalId(animal.id)

    return {
      ...animal,
      photos: photos.map((photo) => ({
        id: photo.id,
        uuid: photo.uuid,
        animal_id: photo.animal_id,
        photo_url: `${this.storageProvider.url}/animals/${photo.photo_url}`,
        order_index: photo.order_index,
        created_at: photo.created_at,
      })),
      tags: tags.map((tag) => ({
        id: tag.uuid,
        label: tag.label,
        color: tag.color,
      })),
    }
  }

  async executeAll(filters?: {
    type?: 'dog' | 'cat'
    breed?: string
    minAge?: number
    maxAge?: number
  }): Promise<IAnimalResponseDTO[]> {
    const animals = await this.animalRepository.findAll(filters)

    const animalsWithDetails = await Promise.all(
      animals.map(async (animal) => {
        const photos = await this.animalPhotoRepository.findByAnimalId(animal.id)
        const tags = await this.animalTagRepository.findByAnimalId(animal.id)

        return {
          ...animal,
          photos: photos.map((photo) => ({
            id: photo.id,
            uuid: photo.uuid,
            animal_id: photo.animal_id,
            photo_url: `${this.storageProvider.url}/animals/${photo.photo_url}`,
            order_index: photo.order_index,
            created_at: photo.created_at,
          })),
          tags: tags.map((tag) => ({
            id: tag.uuid,
            label: tag.label,
            color: tag.color,
          })),
        }
      }),
    )

    return animalsWithDetails
  }
}

export { GetAnimalUseCase }
