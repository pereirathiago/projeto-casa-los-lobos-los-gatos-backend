import { db } from '@shared/database/connection.js'
import { AnimalPhotoRepository } from '@src/modules/animals/repositories/AnimalPhotoRepository.js'
import { AnimalRepository } from '@src/modules/animals/repositories/AnimalRepository.js'
import { AnimalTagRepository } from '@src/modules/animals/repositories/AnimalTagRepository.js'
import { IAnimalPhotoRepository } from '@src/modules/animals/repositories/interfaces/IAnimalPhotoRepository.js'
import { IAnimalRepository } from '@src/modules/animals/repositories/interfaces/IAnimalRepository.js'
import { IAnimalTagRepository } from '@src/modules/animals/repositories/interfaces/IAnimalTagRepository.js'
import { IUserRepository } from '@src/modules/authentication/repositories/interfaces/IUserRepository.js'
import { IUserSessionRepository } from '@src/modules/authentication/repositories/interfaces/IUserSessionRepository.js'
import { UserRepository } from '@src/modules/authentication/repositories/UserRepository.js'
import { UserSessionRepository } from '@src/modules/authentication/repositories/UserSessionRepository.js'
import { HelloWorldRepository } from '@src/modules/common/repositories/HelloWorldRepository.js'
import { IHelloWorldRepository } from '@src/modules/common/repositories/interfaces/IHelloWorldRepository.js'
import { container } from 'tsyringe'
import './providers/index.js'

container.register('KnexConnection', { useValue: db })

// common
container.register<IHelloWorldRepository>('HelloWorldRepository', HelloWorldRepository)

// authentication
container.registerSingleton<IUserRepository>('UserRepository', UserRepository)
container.registerSingleton<IUserSessionRepository>('UserSessionRepository', UserSessionRepository)

// animals
container.registerSingleton<IAnimalRepository>('AnimalRepository', AnimalRepository)
container.registerSingleton<IAnimalPhotoRepository>('AnimalPhotoRepository', AnimalPhotoRepository)
container.registerSingleton<IAnimalTagRepository>('AnimalTagRepository', AnimalTagRepository)

export { container }
