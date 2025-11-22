import { GetAllSponsorsController } from '@src/modules/sponsors/controllers/GetAllSponsorsController.js'
import { Router } from 'express'
import { container } from 'tsyringe'
import { ensureAdminRole } from '../middlewares/ensureAdminRole.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

const router = Router()
const getAllSponsorsController = container.resolve(GetAllSponsorsController)

router.get('/', ensureAuthenticated, ensureAdminRole, (req, res) =>
  getAllSponsorsController.handle(req, res),
)

export default router
