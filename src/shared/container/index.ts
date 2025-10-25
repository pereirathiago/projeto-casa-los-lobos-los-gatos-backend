import { IUserRepository, UserRepository } from '@src/modules/authentication/repositories/UserRepository.js'
import { IUserSessionRepository, UserSessionRepository } from '@src/modules/authentication/repositories/UserSessionRepository.js'
import { HelloWorldRepository } from '@src/modules/common/repositories/HelloWorldRepository.js'
import { IHelloWorldRepository } from '@src/modules/common/repositories/interfaces/IHelloWorldRepository.js'
import { container } from 'tsyringe'

// Register HelloWorld dependencies
container.register<IHelloWorldRepository>('HelloWorldRepository', HelloWorldRepository)

// Register Auth dependencies
container.register<IUserRepository>('UserRepository', UserRepository)
container.register<IUserSessionRepository>('UserSessionRepository', UserSessionRepository)

export { container }
