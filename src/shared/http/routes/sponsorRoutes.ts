import { DeleteSponsorController } from '@modules/sponsors/controllers/DeleteSponsorController.js'
import { GetSponsorController } from '@modules/sponsors/controllers/GetSponsorController.js'
import { UpdateSponsorController } from '@modules/sponsors/controllers/UpdateSponsorController.js'
import { validateUpdateSponsor } from '@modules/sponsors/validations/validateSponsor.js'
import { container } from '@shared/container/index.js'
import { GetSponsorshipBySponsorController } from '@src/modules/sponsorships/controllers/GetSponsorshipsBySponsor.js'
import { Router } from 'express'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'
import { ensureSponsorRole } from '../middlewares/ensureSponsorRole.js'

const router = Router()

const getSponsorController = container.resolve(GetSponsorController)
const updateSponsorController = container.resolve(UpdateSponsorController)
const deleteSponsorController = container.resolve(DeleteSponsorController)
const getSponsorshipBySponsorController = container.resolve(GetSponsorshipBySponsorController)

router.get('/me', ensureAuthenticated, ensureSponsorRole, (req, res) =>
  getSponsorController.handle(req, res),
)
router.put('/me', ensureAuthenticated, ensureSponsorRole, validateUpdateSponsor, (req, res) =>
  updateSponsorController.handle(req, res),
)
router.delete('/me', ensureAuthenticated, ensureSponsorRole, (req, res) =>
  deleteSponsorController.handle(req, res),
)
router.get('/me/sponsorships', ensureAuthenticated, ensureSponsorRole, (req, res) => {
  getSponsorshipBySponsorController.handle(req, res)
})

export default router
