import { container } from '@shared/container/index.js'
import { AnimalController } from '@src/modules/animals/controllers/AnimalController.js'
import {
  validateCreateAnimal,
  validateUpdateAnimal,
} from '@src/modules/animals/validations/validateAnimal.js'
import { uploadAnimalPhotos } from '@src/utils/uploadConfig.js'
import { Router } from 'express'
import { ensureAdminRole } from '../middlewares/ensureAdminRole.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

const router = Router()

const animalController = container.resolve(AnimalController)

router.get('/', (req, res) => animalController.getAll(req, res))
router.get('/:uuid', (req, res) => animalController.getById(req, res))

// Rotas protegidas - requerem autenticação e role de admin
router.use(ensureAuthenticated)
router.use(ensureAdminRole)

// CREATE - máximo 3 fotos
router.post('/', uploadAnimalPhotos.array('photos', 3), validateCreateAnimal, (req, res) =>
  animalController.create(req, res),
)

// UPDATE - máximo 3 fotos opcionais
router.put('/:uuid', uploadAnimalPhotos.array('photos', 3), validateUpdateAnimal, (req, res) =>
  animalController.update(req, res),
)

// DELETE
router.delete('/:uuid', (req, res) => animalController.delete(req, res))

export default router
