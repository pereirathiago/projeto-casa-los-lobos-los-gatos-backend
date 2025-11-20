import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { NotFoundError } from '@shared/errors/index.js'
import { inject, injectable } from 'tsyringe'

@injectable()
class DeleteAnimalUseCase {
  constructor(@inject('AnimalRepository') private animalRepository: IAnimalRepository) {}

  async execute(uuid: string): Promise<void> {
    const animal = await this.animalRepository.findByUuid(uuid)

    if (!animal) {
      throw new NotFoundError('Animal não encontrado')
    }

    await this.animalRepository.delete(animal.id)
  }
}

export { DeleteAnimalUseCase }
