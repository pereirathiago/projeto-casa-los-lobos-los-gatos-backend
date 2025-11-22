import { IAnimalResponseDTO, IUpdateAnimalDTO } from '@modules/animals/dtos/IAnimalDTO.js'
import { IAnimalPhotoRepository } from '@modules/animals/repositories/interfaces/IAnimalPhotoRepository.js'
import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { IAnimalTagRepository } from '@modules/animals/repositories/interfaces/IAnimalTagRepository.js'
import { NotFoundError } from '@shared/errors/index.js'
import { IStorageProvider } from '@src/shared/container/providers/storage-provider/i-storage-provider.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

@injectable()
class UpdateAnimalInfoUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('AnimalRepository') private animalRepository: IAnimalRepository,
    @inject('AnimalPhotoRepository') private animalPhotoRepository: IAnimalPhotoRepository,
    @inject('AnimalTagRepository') private animalTagRepository: IAnimalTagRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  async execute(uuid: string, data: IUpdateAnimalDTO): Promise<IAnimalResponseDTO> {
    const existingAnimal = await this.animalRepository.findByUuid(uuid)

    if (!existingAnimal) {
      throw new NotFoundError('Animal não encontrado')
    }

    const updatedAnimal = await this.db.transaction(async (trx) => {
      const updateData: any = {}

      if (data.name !== undefined) updateData.name = data.name
      if (data.type !== undefined) updateData.type = data.type
      if (data.breed !== undefined) updateData.breed = data.breed
      if (data.age !== undefined) updateData.age = data.age
      if (data.description !== undefined) updateData.description = data.description

      let animal = existingAnimal

      if (Object.keys(updateData).length > 0) {
        animal = await this.animalRepository.update(existingAnimal.id, updateData, trx)
      }

      if (data.tags !== undefined) {
        await this.animalTagRepository.deleteByAnimalId(existingAnimal.id, trx)

        if (data.tags.length > 0) {
          const tagsData = data.tags.map((tag) => ({
            label: tag.label,
            color: tag.color,
          }))

          await this.animalTagRepository.createMany(existingAnimal.id, tagsData, trx)
        }
      }

      return animal
    })

    const photos = await this.animalPhotoRepository.findByAnimalId(updatedAnimal.id)
    const tags = await this.animalTagRepository.findByAnimalId(updatedAnimal.id)

    return {
      ...updatedAnimal,
      slug: updatedAnimal.id + '-' + updatedAnimal.name.toLowerCase().replace(/\s+/g, '-'),
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
}

export { UpdateAnimalInfoUseCase }
