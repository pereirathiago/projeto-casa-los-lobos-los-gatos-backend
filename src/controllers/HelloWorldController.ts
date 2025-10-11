import { Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import { IHelloWorldRepository } from '../repositories/HelloWorldRepository'

@injectable()
export class HelloWorldController {
  constructor(
    @inject('HelloWorldRepository')
    private helloWorldRepository: IHelloWorldRepository,
  ) {}

  getHelloWorld(req: Request, res: Response): Response {
    try {
      const result = this.helloWorldRepository.getHelloMessage()
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}
