import { IAnimalResponseDTO, IUpdateAnimalDTO } from '@modules/animals/dtos/IAnimalDTO.js'
import { IAnimalPhotoRepository } from '@modules/animals/repositories/interfaces/IAnimalPhotoRepository.js'
import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { IAnimalTagRepository } from '@modules/animals/repositories/interfaces/IAnimalTagRepository.js'
import { NotFoundError } from '@shared/errors/index.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

interface IUpdateAnimalRequest extends IUpdateAnimalDTO {
  photos?: string[] // URLs das novas fotos, se fornecidas
}

@injectable()
class UpdateAnimalUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('AnimalRepository') private animalRepository: IAnimalRepository,
    @inject('AnimalPhotoRepository') private animalPhotoRepository: IAnimalPhotoRepository,
    @inject('AnimalTagRepository') private animalTagRepository: IAnimalTagRepository,
  ) {}

  async execute(uuid: string, data: IUpdateAnimalRequest): Promise<IAnimalResponseDTO> {
    const existingAnimal = await this.animalRepository.findByUuid(uuid)

    if (!existingAnimal) {
      throw new NotFoundError('Animal não encontrado')
    }

    const updatedAnimal = await this.db.transaction(async (trx) => {
      // Atualizar dados básicos do animal
      const updateData: any = {}

      if (data.name) updateData.name = data.name
      if (data.type) updateData.type = data.type
      if (data.breed) updateData.breed = data.breed
      if (data.age !== undefined) updateData.age = data.age
      if (data.description) updateData.description = data.description

      let animal = existingAnimal

      if (Object.keys(updateData).length > 0) {
        animal = await this.animalRepository.update(existingAnimal.id, updateData, trx)
      }

      // Atualizar fotos se fornecidas
      if (data.photos && data.photos.length > 0) {
        // Deletar fotos antigas
        await this.animalPhotoRepository.deleteByAnimalId(existingAnimal.id, trx)

        // Criar novas fotos
        const photosData = data.photos.map((photoUrl, index) => ({
          photoUrl,
          orderIndex: index,
        }))

        await this.animalPhotoRepository.createMany(existingAnimal.id, photosData, trx)

        // Atualizar photo_url principal
        await this.animalRepository.update(
          existingAnimal.id,
          {
            photo_url: data.photos[0],
          },
          trx,
        )

        animal.photo_url = data.photos[0]
      }

      // Atualizar tags se fornecidas
      if (data.tags !== undefined) {
        // Deletar tags antigas
        await this.animalTagRepository.deleteByAnimalId(existingAnimal.id, trx)

        // Criar novas tags se existirem
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

    // Buscar animal completo com fotos e tags
    const photos = await this.animalPhotoRepository.findByAnimalId(updatedAnimal.id)
    const tags = await this.animalTagRepository.findByAnimalId(updatedAnimal.id)

    return {
      ...updatedAnimal,
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
  }
}

export { UpdateAnimalUseCase }
