import { IAnimalPhotoRepository } from '@modules/animals/repositories/interfaces/IAnimalPhotoRepository.js'
import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { IAnimalTagRepository } from '@modules/animals/repositories/interfaces/IAnimalTagRepository.js'
import { NotFoundError } from '@shared/errors/index.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

@injectable()
class DeleteAnimalUseCase {
  constructor(
    @inject('KnexConnection') private db: Knex,
    @inject('AnimalRepository') private animalRepository: IAnimalRepository,
    @inject('AnimalPhotoRepository') private animalPhotoRepository: IAnimalPhotoRepository,
    @inject('AnimalTagRepository') private animalTagRepository: IAnimalTagRepository,
  ) {}

  async execute(uuid: string): Promise<void> {
    const animal = await this.animalRepository.findByUuid(uuid)

    if (!animal) {
      throw new NotFoundError('Animal não encontrado')
    }

    await this.db.transaction(async (trx) => {
      // Deletar fotos
      await this.animalPhotoRepository.deleteByAnimalId(animal.id, trx)

      // Deletar tags
      await this.animalTagRepository.deleteByAnimalId(animal.id, trx)

      // Deletar animal
      await this.animalRepository.delete(animal.id, trx)
    })
  }
}

export { DeleteAnimalUseCase }
