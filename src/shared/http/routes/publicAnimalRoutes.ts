import { container } from '@shared/container/index.js'
import { AnimalController } from '@src/modules/animals/controllers/AnimalController.js'
import { Router } from 'express'
import { ensureStaticToken } from '../middlewares/ensureStaticToken.js'

const router = Router()

const animalController = container.resolve(AnimalController)

router.use(ensureStaticToken)

router.get('/', (req, res) => animalController.getAll(req, res))
router.get('/:slug', (req, res) => animalController.getBySlug(req, res))

export default router
