import { db } from '@shared/database/connection.js'
import { IUserRepository } from '@src/modules/authentication/repositories/interfaces/IUserRepository.js'
import { IUserSessionRepository } from '@src/modules/authentication/repositories/interfaces/IUserSessionRepository.js'
import { UserRepository } from '@src/modules/authentication/repositories/UserRepository.js'
import { UserSessionRepository } from '@src/modules/authentication/repositories/UserSessionRepository.js'
import { HelloWorldRepository } from '@src/modules/common/repositories/HelloWorldRepository.js'
import { IHelloWorldRepository } from '@src/modules/common/repositories/interfaces/IHelloWorldRepository.js'
import { container } from 'tsyringe'

container.register('KnexConnection', { useValue: db })

// common
container.register<IHelloWorldRepository>('HelloWorldRepository', HelloWorldRepository)

// authentication
container.registerSingleton<IUserRepository>('UserRepository', UserRepository)
container.registerSingleton<IUserSessionRepository>('UserSessionRepository', UserSessionRepository)

export { container }
