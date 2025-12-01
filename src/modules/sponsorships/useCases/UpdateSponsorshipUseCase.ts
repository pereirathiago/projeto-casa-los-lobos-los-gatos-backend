import { NotFoundError } from '@shared/errors/http.js'
import { inject, injectable } from 'tsyringe'
import { IAnimalRepository } from '../../animals/repositories/interfaces/IAnimalRepository.js'
import { IUserRepository } from '../../authentication/repositories/interfaces/IUserRepository.js'
import { ISponsorshipResponseDTO, IUpdateSponsorshipDTO } from '../dtos/ISponsorshipDTO.js'
import { ISponsorshipRepository } from '../repositories/interfaces/ISponsorshipRepository.js'

interface IRequest {
  uuid: string
  animalUuid?: string
  monthlyAmount?: number
  active?: boolean
}

@injectable()
export class UpdateSponsorshipUseCase {
  constructor(
    @inject('SponsorshipRepository')
    private sponsorshipRepository: ISponsorshipRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('AnimalRepository')
    private animalRepository: IAnimalRepository,
  ) {}

  async execute({
    uuid,
    animalUuid,
    monthlyAmount,
    active,
  }: IRequest): Promise<ISponsorshipResponseDTO> {
    const sponsorship = await this.sponsorshipRepository.findByUuid(uuid)

    if (!sponsorship) {
      throw new NotFoundError('Apadrinhamento não encontrado')
    }

    const updateData: IUpdateSponsorshipDTO = {}

    if (animalUuid) {
      const animal = await this.animalRepository.findByUuid(animalUuid)

      if (!animal) {
        throw new NotFoundError('Animal não encontrado')
      }

      updateData.animalId = animal.id
    }

    if (monthlyAmount !== undefined) {
      updateData.monthlyAmount = monthlyAmount
    }

    if (active !== undefined) {
      updateData.active = active
    }

    const updatedSponsorship = await this.sponsorshipRepository.update(sponsorship.id, updateData)

    const user = await this.userRepository.findById(updatedSponsorship.user_id)
    const animal = await this.animalRepository.findById(updatedSponsorship.animal_id)

    return {
      uuid: updatedSponsorship.uuid,
      user: {
        uuid: user!.uuid,
        name: user!.name,
        email: user!.email,
      },
      animal: {
        uuid: animal!.uuid,
        name: animal!.name,
        type: animal!.type,
        breed: animal!.breed,
      },
      monthlyAmount: updatedSponsorship.monthly_amount,
      active: updatedSponsorship.active,
      date: updatedSponsorship.created_at,
    }
  }
}
