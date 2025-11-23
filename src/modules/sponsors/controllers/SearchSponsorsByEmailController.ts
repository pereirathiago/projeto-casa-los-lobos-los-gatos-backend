import { Request, Response } from 'express'
import { container, injectable } from 'tsyringe'
import { SearchSponsorsByEmailUseCase } from '../useCases/SearchSponsorsByEmailUseCase.js'

@injectable()
export class SearchSponsorsByEmailController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email } = request.query

    if (!email || typeof email !== 'string') {
      return response.status(400).json({ error: 'Email query parameter is required' })
    }

    const searchSponsorsByEmailUseCase = container.resolve(SearchSponsorsByEmailUseCase)

    const sponsors = await searchSponsorsByEmailUseCase.execute({ email: email.toLowerCase() })

    return response.status(200).json(sponsors)
  }
}
