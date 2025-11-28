import { Request, Response } from 'express'
import { container, injectable } from 'tsyringe'
import { SearchAnimalsByNameUseCase } from '../useCases/SearchAnimalsByNameUseCase.js'

@injectable()
export class SearchAnimalsByNameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.query

    if (!name || typeof name !== 'string') {
      return response.status(400).json({ error: 'Name query parameter is required' })
    }
    const searchAnimalsByNameUseCase = container.resolve(SearchAnimalsByNameUseCase)
    const animals = await searchAnimalsByNameUseCase.execute({ name })

    return response.status(200).json(animals)
  }
}
