import { container } from 'tsyringe'
import { HelloWorldRepository, IHelloWorldRepository } from '../repositories/HelloWorldRepository'

container.register<IHelloWorldRepository>('HelloWorldRepository', HelloWorldRepository)

export { container }
