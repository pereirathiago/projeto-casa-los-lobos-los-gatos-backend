import { IHelloWorldRepository } from './interfaces/IHelloWorldRepository.js'

class HelloWorldRepository implements IHelloWorldRepository {
  public getMessage(): string {
    return 'Hello, World!'
  }
}

export { HelloWorldRepository }
