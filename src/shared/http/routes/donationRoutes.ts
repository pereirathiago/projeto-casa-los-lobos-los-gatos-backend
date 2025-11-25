import { container } from '@shared/container/index.js'
import { ConfirmDonationController } from '@src/modules/donations/controllers/ConfirmDonationController.js'
import { CreateDonationController } from '@src/modules/donations/controllers/CreateDonationController.js'
import { DeleteDonationController } from '@src/modules/donations/controllers/DeleteDonationController.js'
import { GetAllDonationsController } from '@src/modules/donations/controllers/GetAllDonationsController.js'
import { GetDonationController } from '@src/modules/donations/controllers/GetDonationController.js'
import { validateCreateDonation } from '@src/modules/donations/validations/validateDonation.js'
import { Router } from 'express'
import { ensureAdminRole } from '../middlewares/ensureAdminRole.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

const router = Router()

const createDonationController = container.resolve(CreateDonationController)
const getAllDonationsController = container.resolve(GetAllDonationsController)
const getDonationController = container.resolve(GetDonationController)
const confirmDonationController = container.resolve(ConfirmDonationController)
const deleteDonationController = container.resolve(DeleteDonationController)

router.use(ensureAuthenticated)
router.use(ensureAdminRole)

router.post('/', validateCreateDonation, (req, res) => createDonationController.handle(req, res))
router.get('/', (req, res) => getAllDonationsController.handle(req, res))
router.get('/:uuid', (req, res) => getDonationController.handle(req, res))
router.patch('/:uuid/confirm', (req, res) => confirmDonationController.handle(req, res))
router.delete('/:uuid', (req, res) => deleteDonationController.handle(req, res))

export default router
