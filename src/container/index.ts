import { container } from 'tsyringe'
import { HelloWorldRepository, IHelloWorldRepository } from '../repositories/HelloWorldRepository'
import { UserRepository, IUserRepository } from '../repositories/UserRepository'
import { UserSessionRepository, IUserSessionRepository } from '../repositories/UserSessionRepository'

// Register HelloWorld dependencies
container.register<IHelloWorldRepository>('HelloWorldRepository', HelloWorldRepository)

// Register Auth dependencies
container.register<IUserRepository>('UserRepository', UserRepository)
container.register<IUserSessionRepository>('UserSessionRepository', UserSessionRepository)

export { container }
