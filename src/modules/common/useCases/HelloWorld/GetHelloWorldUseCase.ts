import { IHelloWorldRepository } from '@modules/common/repositories/interfaces/IHelloWorldRepository.js'
import { inject, injectable } from 'tsyringe'

@injectable()
class GetHelloWorldUseCase {
  constructor(
    @inject('HelloWorldRepository')
    private helloWorldRepository: IHelloWorldRepository,
  ) {}

  async execute(): Promise<string> {
    const message = await this.helloWorldRepository.getMessage()

    return message
  }
}

export { GetHelloWorldUseCase }
