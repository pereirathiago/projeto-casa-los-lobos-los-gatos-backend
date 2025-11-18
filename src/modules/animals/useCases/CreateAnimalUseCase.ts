import { IAnimalResponseDTO, ICreateAnimalDTO } from '@modules/animals/dtos/IAnimalDTO.js'
import { IAnimalPhotoRepository } from '@modules/animals/repositories/interfaces/IAnimalPhotoRepository.js'
import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { IAnimalTagRepository } from '@modules/animals/repositories/interfaces/IAnimalTagRepository.js'
import { ValidationError } from '@shared/errors/index.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

interface ICreateAnimalRequest extends ICreateAnimalDTO {
  photos: string[] // URLs das fotos já salvas
}

@injectable()
class CreateAnimalUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('AnimalRepository') private animalRepository: IAnimalRepository,
    @inject('AnimalPhotoRepository') private animalPhotoRepository: IAnimalPhotoRepository,
    @inject('AnimalTagRepository') private animalTagRepository: IAnimalTagRepository,
  ) {}

  async execute(data: ICreateAnimalRequest): Promise<IAnimalResponseDTO> {
    // Validação de fotos
    if (!data.photos || data.photos.length === 0) {
      throw new ValidationError([
        {
          field: 'photos',
          message: 'Pelo menos uma foto é obrigatória',
        },
      ])
    }

    if (data.photos.length > 3) {
      throw new ValidationError([
        {
          field: 'photos',
          message: 'Máximo de 3 fotos permitidas',
        },
      ])
    }

    const animal = await this.db.transaction(async (trx) => {
      // Criar animal
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

      // Salvar fotos
      const photosData = data.photos.map((photoUrl, index) => ({
        photoUrl,
        orderIndex: index,
      }))

      const photos = await this.animalPhotoRepository.createMany(newAnimal.id, photosData, trx)

      // Atualizar photo_url principal (primeira foto)
      await this.animalRepository.update(
        newAnimal.id,
        {
          photo_url: photos[0].photo_url,
        },
        trx,
      )

      // Salvar tags se existirem
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
        photo_url: photos[0].photo_url,
        photos: photos.map((photo) => ({
          id: photo.id,
          uuid: photo.uuid,
          animal_id: photo.animal_id,
          photo_url: photo.photo_url,
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
