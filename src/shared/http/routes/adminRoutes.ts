import { container } from '@shared/container/index.js'
import { AdminController } from '@src/modules/authentication/controllers/AdminController.js'
import {
  validateCreateAdmin,
  validateUpdateAdmin,
} from '@src/modules/authentication/validations/validateAdmin.js'
import { AdminDashboardController } from '@src/modules/dashboard/controllers/AdminDashboardController.js'
import { Router } from 'express'
import { ensureAdminRole } from '../middlewares/ensureAdminRole.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'
import { ensureMasterAdmin } from '../middlewares/ensureMasterAdmin.js'

const router = Router()

const adminController = container.resolve(AdminController)
const adminDashboardController = container.resolve(AdminDashboardController)

router.use(ensureAuthenticated)
router.use(ensureAdminRole)

router.get('/dashboard', (req, res) => adminDashboardController.handle(req, res))
// Rotas para admin comum gerenciar seu próprio perfil
router.get('/me', (req, res) => adminController.getById(req, res))
router.put('/me', validateUpdateAdmin, (req, res) => adminController.update(req, res))

// Rotas restritas ao Master Admin
router.post('/', ensureMasterAdmin, validateCreateAdmin, (req, res) =>
  adminController.create(req, res),
)
router.get('/', ensureMasterAdmin, (req, res) => adminController.getAll(req, res))
router.get('/:id', ensureMasterAdmin, (req, res) => adminController.getById(req, res))
router.put('/:id', ensureMasterAdmin, validateUpdateAdmin, (req, res) =>
  adminController.update(req, res),
)
router.delete('/:id', ensureMasterAdmin, (req, res) => adminController.delete(req, res))

export default router
