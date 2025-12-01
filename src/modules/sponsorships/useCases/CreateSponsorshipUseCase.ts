import { BadRequestError, NotFoundError } from '@shared/errors/http.js'
import { inject, injectable } from 'tsyringe'
import { IAnimalRepository } from '../../animals/repositories/interfaces/IAnimalRepository.js'
import { IUserRepository } from '../../authentication/repositories/interfaces/IUserRepository.js'
import { ISponsorshipResponseDTO } from '../dtos/ISponsorshipDTO.js'
import { ISponsorshipRepository } from '../repositories/interfaces/ISponsorshipRepository.js'

interface IRequest {
  userUuid: string
  animalUuid: string
  monthlyAmount: number
}

@injectable()
export class CreateSponsorshipUseCase {
  constructor(
    @inject('SponsorshipRepository')
    private sponsorshipRepository: ISponsorshipRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('AnimalRepository')
    private animalRepository: IAnimalRepository,
  ) {}

  async execute({
    userUuid,
    animalUuid,
    monthlyAmount,
  }: IRequest): Promise<ISponsorshipResponseDTO> {
    const user = await this.userRepository.findByUuid(userUuid)
    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    if (user.role !== 'sponsor') {
      throw new BadRequestError('O usuário deve ser um padrinho')
    }

    const animal = await this.animalRepository.findByUuid(animalUuid)
    if (!animal) {
      throw new NotFoundError('Animal não encontrado')
    }

    const existingSponsorship = await this.sponsorshipRepository.findByUserAndAnimal(
      user.id,
      animal.id,
    )

    if (existingSponsorship) {
      throw new BadRequestError('Já existe um apadrinhamento para este usuário e animal')
    }

    const sponsorship = await this.sponsorshipRepository.create({
      userId: user.id,
      animalId: animal.id,
      monthlyAmount: monthlyAmount,
    })

    return {
      uuid: sponsorship.uuid,
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
      },
      animal: {
        uuid: animal.uuid,
        name: animal.name,
        type: animal.type,
        breed: animal.breed,
      },
      monthlyAmount: sponsorship.monthly_amount,
      active: sponsorship.active,
      date: sponsorship.created_at,
    }
  }
}
