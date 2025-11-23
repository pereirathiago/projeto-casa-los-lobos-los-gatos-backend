import { GetAllSponsorsController } from '@src/modules/sponsors/controllers/GetAllSponsorsController.js'
import { SearchSponsorsByEmailController } from '@src/modules/sponsors/controllers/SearchSponsorsByEmailController.js'
import { Router } from 'express'
import { container } from 'tsyringe'
import { ensureAdminRole } from '../middlewares/ensureAdminRole.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

const router = Router()
const getAllSponsorsController = container.resolve(GetAllSponsorsController)
const searchSponsorsByEmailController = container.resolve(SearchSponsorsByEmailController)

router.get('/', ensureAuthenticated, ensureAdminRole, (req, res) =>
  getAllSponsorsController.handle(req, res),
)
router.get('/search', ensureAuthenticated, ensureAdminRole, (req, res) =>
  searchSponsorsByEmailController.handle(req, res),
)

export default router
