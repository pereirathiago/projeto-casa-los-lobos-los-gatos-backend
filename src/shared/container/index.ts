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
import { ISponsorRepository } from '@src/modules/sponsors/repositories/interfaces/ISponsorRepository.js'
import { SponsorRepository } from '@src/modules/sponsors/repositories/SponsorRepository.js'
import { ISponsorshipRepository } from '@src/modules/sponsorships/repositories/interfaces/ISponsorshipRepository.js'
import { SponsorshipRepository } from '@src/modules/sponsorships/repositories/SponsorshipRepository.js'
import { container } from 'tsyringe'
import './providers/index.js'

container.register('KnexConnection', { useValue: db })
container.register<IHelloWorldRepository>('HelloWorldRepository', HelloWorldRepository)
container.registerSingleton<IUserRepository>('UserRepository', UserRepository)
container.registerSingleton<IUserSessionRepository>('UserSessionRepository', UserSessionRepository)
container.registerSingleton<ISponsorRepository>('SponsorRepository', SponsorRepository)
container.registerSingleton<IAnimalRepository>('AnimalRepository', AnimalRepository)
container.registerSingleton<IAnimalPhotoRepository>('AnimalPhotoRepository', AnimalPhotoRepository)
container.registerSingleton<IAnimalTagRepository>('AnimalTagRepository', AnimalTagRepository)
container.registerSingleton<ISponsorshipRepository>('SponsorshipRepository', SponsorshipRepository)

export { container }
