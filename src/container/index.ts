import { container } from 'tsyringe'
import { HelloWorldRepository, IHelloWorldRepository } from '../repositories/HelloWorldRepository.js'
import { IUserRepository, UserRepository } from '../repositories/UserRepository.js'
import { IUserSessionRepository, UserSessionRepository } from '../repositories/UserSessionRepository.js'

// Register HelloWorld dependencies
container.register<IHelloWorldRepository>('HelloWorldRepository', HelloWorldRepository)

// Register Auth dependencies
container.register<IUserRepository>('UserRepository', UserRepository)
container.register<IUserSessionRepository>('UserSessionRepository', UserSessionRepository)

export { container }
