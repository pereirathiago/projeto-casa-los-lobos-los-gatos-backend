import { Router } from 'express'
import { container } from '../container/index.js'
import { AuthenticateUserController } from '../controllers/AuthenticateUserController.js'
import { LogoutUserController } from '../controllers/LogoutUserController.js'
import { RegisterUserController } from '../controllers/RegisterUserController.js'
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
