import { container } from '@shared/container/index.js'
import { CreateSponsorshipController } from '@src/modules/sponsorships/controllers/CreateSponsorshipController.js'
import { validateCreateSponsorship } from '@src/modules/sponsorships/validations/validateSponsorship.js'
import { Router } from 'express'
import { ensureAdminRole } from '../middlewares/ensureAdminRole.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

const router = Router()

const createSponsorshipController = container.resolve(CreateSponsorshipController)

router.use(ensureAuthenticated)
router.use(ensureAdminRole)

router.post('/', validateCreateSponsorship, (req, res) =>
  createSponsorshipController.handle(req, res),
)

export default router
