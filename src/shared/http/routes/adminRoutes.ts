import { container } from '@shared/container/index.js'
import { AdminController } from '@src/modules/authentication/controllers/AdminController.js'
import {
  validateCreateAdmin,
  validateUpdateAdmin,
} from '@src/modules/authentication/validations/validateAdmin.js'
import { Router } from 'express'
import { ensureAdminRole } from '../middlewares/ensureAdminRole.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

const router = Router()

const adminController = container.resolve(AdminController)

// Todas as rotas requerem autenticação e role de admin
router.use(ensureAuthenticated)
router.use(ensureAdminRole)

// CRUD de administradores
router.post('/', validateCreateAdmin, (req, res) => adminController.create(req, res))
router.get('/', (req, res) => adminController.getAll(req, res))
router.get('/:id', (req, res) => adminController.getById(req, res))
router.put('/:id', validateUpdateAdmin, (req, res) => adminController.update(req, res))
router.delete('/:id', (req, res) => adminController.delete(req, res))

export default router
