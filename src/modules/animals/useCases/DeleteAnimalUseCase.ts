import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { ISponsorshipRepository } from '@modules/sponsorships/repositories/interfaces/ISponsorshipRepository.js'
import { NotFoundError } from '@shared/errors/index.js'
import { inject, injectable } from 'tsyringe'

@injectable()
class DeleteAnimalUseCase {
  constructor(
    @inject('AnimalRepository') private animalRepository: IAnimalRepository,
    @inject('SponsorshipRepository') private sponsorshipRepository: ISponsorshipRepository,
  ) {}

  async execute(uuid: string): Promise<void> {
    const animal = await this.animalRepository.findByUuid(uuid)

    if (!animal) {
      throw new NotFoundError('Animal não encontrado')
    }

    await this.sponsorshipRepository.deactivateByAnimalId(animal.id)

    await this.animalRepository.delete(animal.id)
  }
}

export { DeleteAnimalUseCase }
