import uploadConfig from '@config/upload.js'
import { container } from '@shared/container/index.js'
import { AnimalController } from '@src/modules/animals/controllers/AnimalController.js'
import {
  validateCreateAnimal,
  validateUpdateAnimal,
} from '@src/modules/animals/validations/validateAnimal.js'
import { Router } from 'express'
import multer from 'multer'
import { ensureAdminRole } from '../middlewares/ensureAdminRole.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

const router = Router()
const uploadAnimalImages = multer(uploadConfig)

const animalController = container.resolve(AnimalController)

router.use(ensureAuthenticated)
router.use(ensureAdminRole)

router.get('/', (req, res) => animalController.getAll(req, res))
router.get('/:uuid', (req, res) => animalController.getById(req, res))

router.post('/', uploadAnimalImages.array('arquivos', 3), validateCreateAnimal, (req, res) =>
  animalController.create(req, res),
)

router.put('/:uuid', validateUpdateAnimal, (req, res) => animalController.update(req, res))

router.post('/:uuid/photos', uploadAnimalImages.single('arquivo'), (req, res) =>
  animalController.addPhoto(req, res),
)

router.delete('/:uuid/photos/:photoUuid', (req, res) => animalController.deletePhoto(req, res))

router.delete('/:uuid', (req, res) => animalController.delete(req, res))

export default router
