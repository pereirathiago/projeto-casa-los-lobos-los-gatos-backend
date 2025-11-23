import { container } from '@shared/container/index.js'
import { CreateSponsorshipController } from '@src/modules/sponsorships/controllers/CreateSponsorshipController.js'
import { GetAllSponsorshipsController } from '@src/modules/sponsorships/controllers/GetAllSponsorshipsController.js'
import { GetSponsorshipController } from '@src/modules/sponsorships/controllers/GetSponsorshipController.js'
import { validateCreateSponsorship } from '@src/modules/sponsorships/validations/validateSponsorship.js'
import { Router } from 'express'
import { ensureAdminRole } from '../middlewares/ensureAdminRole.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

const router = Router()

const createSponsorshipController = container.resolve(CreateSponsorshipController)
const getAllSponsorshipsController = container.resolve(GetAllSponsorshipsController)
const getSponsorshipController = container.resolve(GetSponsorshipController)

router.use(ensureAuthenticated)
router.use(ensureAdminRole)

router.post('/', validateCreateSponsorship, (req, res) =>
  createSponsorshipController.handle(req, res),
)
router.get('/', (req, res) => getAllSponsorshipsController.handle(req, res))
router.get('/:id', (req, res) => getSponsorshipController.handle(req, res))

export default router
