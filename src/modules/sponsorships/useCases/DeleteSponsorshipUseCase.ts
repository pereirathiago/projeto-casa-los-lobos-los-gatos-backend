import { NotFoundError } from '@shared/errors/http.js'
import { inject, injectable } from 'tsyringe'
import { ISponsorshipRepository } from '../repositories/interfaces/ISponsorshipRepository.js'

interface IRequest {
  uuid: string
}

@injectable()
export class DeleteSponsorshipUseCase {
  constructor(
    @inject('SponsorshipRepository')
    private sponsorshipRepository: ISponsorshipRepository,
  ) {}

  async execute({ uuid }: IRequest): Promise<void> {
    const sponsorship = await this.sponsorshipRepository.findByUuid(uuid)

    if (!sponsorship) {
      throw new NotFoundError('Apadrinhamento não encontrado')
    }

    await this.sponsorshipRepository.softDelete(sponsorship.id)
  }
}
