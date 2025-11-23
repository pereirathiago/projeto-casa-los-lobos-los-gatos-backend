import { NotFoundError } from '@src/shared/errors/http.js'
import { inject, injectable } from 'tsyringe'
import { ISponsorSearchResult } from '../dtos/ISponsorDTO.js'
import { ISponsorRepository } from '../repositories/interfaces/ISponsorRepository.js'

interface IRequest {
  email: string
}

@injectable()
export class SearchSponsorsByEmailUseCase {
  constructor(
    @inject('SponsorRepository')
    private sponsorRepository: ISponsorRepository,
  ) {}

  async execute({ email }: IRequest): Promise<ISponsorSearchResult> {
    const sponsor = await this.sponsorRepository.searchSponsorsByEmail(email)

    if (!sponsor) {
      throw new NotFoundError('Sponsor not found')
    }

    return sponsor
  }
}
