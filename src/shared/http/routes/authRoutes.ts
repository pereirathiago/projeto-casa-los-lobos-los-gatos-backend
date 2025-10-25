import { container } from '@shared/container/index.js'
import { AuthenticateUserController } from '@src/modules/authentication/controllers/AuthenticateUserController.js'
import { LogoutUserController } from '@src/modules/authentication/controllers/LogoutUserController.js'
import { RegisterUserController } from '@src/modules/authentication/controllers/RegisterUserController.js'
import { Router } from 'express'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

const router = Router()

// Resolve controllers
const authenticateUserController = container.resolve(AuthenticateUserController)
const logoutUserController = container.resolve(LogoutUserController)
const registerUserController = container.resolve(RegisterUserController)

// Routes
router.post('/register', (req, res) => registerUserController.handle(req, res))
router.post('/login', (req, res) => authenticateUserController.handle(req, res))
router.post('/logout', ensureAuthenticated, (req, res) => logoutUserController.handle(req, res))

export default router
