import { IAnimalResponseDTO, ICreateAnimalDTO } from '@modules/animals/dtos/IAnimalDTO.js'
import { IAnimalPhotoRepository } from '@modules/animals/repositories/interfaces/IAnimalPhotoRepository.js'
import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { IAnimalTagRepository } from '@modules/animals/repositories/interfaces/IAnimalTagRepository.js'
import { ValidationError } from '@shared/errors/index.js'
import { IStorageProvider } from '@src/shared/container/providers/storage-provider/i-storage-provider.js'
import type { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

interface ICreateAnimalRequest extends ICreateAnimalDTO {
  files: Express.Multer.File[]
}

@injectable()
class CreateAnimalUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('AnimalRepository') private animalRepository: IAnimalRepository,
    @inject('AnimalPhotoRepository') private animalPhotoRepository: IAnimalPhotoRepository,
    @inject('AnimalTagRepository') private animalTagRepository: IAnimalTagRepository,
    @inject('StorageProvider') private storageProvider: IStorageProvider,
  ) {}

  async execute(data: ICreateAnimalRequest): Promise<IAnimalResponseDTO> {
    if (!data.files || data.files.length === 0) {
      throw new ValidationError([
        {
          field: 'arquivos',
          message: 'Pelo menos uma foto é obrigatória',
        },
      ])
    }

    if (data.files.length > 3) {
      throw new ValidationError([
        {
          field: 'arquivos',
          message: 'Máximo de 3 fotos permitidas',
        },
      ])
    }

    const animal = await this.db.transaction(async (trx) => {
      const newAnimal = await this.animalRepository.create(
        {
          name: data.name,
          type: data.type,
          breed: data.breed,
          age: data.age,
          description: data.description,
        },
        trx,
      )

      for (const file of data.files) {
        await this.storageProvider.save(file.filename, 'animals')
      }

      const photosData = data.files.map((file, index) => ({
        photoUrl: file.filename,
        orderIndex: index,
      }))

      const photos = await this.animalPhotoRepository.createMany(newAnimal.id, photosData, trx)

      let tags = []
      if (data.tags && data.tags.length > 0) {
        const tagsData = data.tags.map((tag) => ({
          label: tag.label,
          color: tag.color,
        }))

        tags = await this.animalTagRepository.createMany(newAnimal.id, tagsData, trx)
      }

      return {
        ...newAnimal,
        slug: newAnimal.id + '-' + newAnimal.name.toLowerCase().replace(/\s+/g, '-'),
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
    })

    return animal as IAnimalResponseDTO
  }
}

export { CreateAnimalUseCase }
