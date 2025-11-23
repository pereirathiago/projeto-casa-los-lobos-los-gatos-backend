import { inject, injectable } from 'tsyringe'
import { IAnimalPhotoRepository } from '../repositories/interfaces/IAnimalPhotoRepository.js'
import { IAnimalRepository } from '../repositories/interfaces/IAnimalRepository.js'

interface IAnimalSearchResult {
  uuid: string
  name: string
  photo_url: string | null
}

interface IRequest {
  name: string
}

@injectable()
export class SearchAnimalsByNameUseCase {
  constructor(
    @inject('AnimalRepository')
    private animalRepository: IAnimalRepository,
    @inject('AnimalPhotoRepository')
    private animalPhotoRepository: IAnimalPhotoRepository,
  ) {}

  async execute({ name }: IRequest): Promise<IAnimalSearchResult[]> {
    const animals = await this.animalRepository.searchByName(name)

    const results = await Promise.all(
      animals.map(async (animal) => {
        const photos = await this.animalPhotoRepository.findByAnimalId(animal.id)
        const firstPhoto = photos.length > 0 ? photos[0].photo_url : null

        return {
          uuid: animal.uuid,
          name: animal.name,
          photo_url: firstPhoto,
        }
      }),
    )

    return results
  }
}
