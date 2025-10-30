import { IUserRepository } from '@src/modules/authentication/repositories/interfaces/IUserRepository.js'
import { UserRepository } from '@src/modules/authentication/repositories/UserRepository.js'
import { IUserSessionRepository, UserSessionRepository } from '@src/modules/authentication/repositories/UserSessionRepository.js'
import { HelloWorldRepository } from '@src/modules/common/repositories/HelloWorldRepository.js'
import { IHelloWorldRepository } from '@src/modules/common/repositories/interfaces/IHelloWorldRepository.js'
import { container } from 'tsyringe'

container.register('KnexConnection', { useValue: {} })

// common
container.register<IHelloWorldRepository>('HelloWorldRepository', HelloWorldRepository)

// authentication
container.registerSingleton<IUserRepository>('UserRepository', UserRepository)
container.registerSingleton<IUserSessionRepository>('UserSessionRepository', UserSessionRepository)

export { container }
