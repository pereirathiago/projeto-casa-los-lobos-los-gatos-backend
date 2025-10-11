import { Router } from 'express'
import { container } from '../container'
import { AuthenticateUserController } from '../controllers/AuthenticateUserController'
import { LogoutUserController } from '../controllers/LogoutUserController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const router = Router()

// Resolve controllers
const authenticateUserController = container.resolve(AuthenticateUserController)
const logoutUserController = container.resolve(LogoutUserController)

// Routes
router.post('/login', (req, res) => authenticateUserController.handle(req, res))
router.post('/logout', ensureAuthenticated, (req, res) => logoutUserController.handle(req, res))

export default router
