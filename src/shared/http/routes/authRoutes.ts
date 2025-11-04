import { container } from '@shared/container/index.js'
import { AuthenticateUserController } from '@src/modules/authentication/controllers/AuthenticateUserController.js'
import { LogoutUserController } from '@src/modules/authentication/controllers/LogoutUserController.js'
import { RefreshTokenController } from '@src/modules/authentication/controllers/RefreshTokenController.js'
import { RegisterUserController } from '@src/modules/authentication/controllers/RegisterUserController.js'
import { validateLogin } from '@src/modules/authentication/validations/validateLogin.js'
import { validateRefreshToken } from '@src/modules/authentication/validations/validateRefreshToken.js'
import { Router } from 'express'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

const router = Router()

const authenticateUserController = container.resolve(AuthenticateUserController)
const logoutUserController = container.resolve(LogoutUserController)
const refreshTokenController = container.resolve(RefreshTokenController)
const registerUserController = container.resolve(RegisterUserController)

router.post('/register', (req, res) => registerUserController.handle(req, res))
router.post('/login', validateLogin, (req, res) => authenticateUserController.handle(req, res))
router.post('/refresh', validateRefreshToken, (req, res) => refreshTokenController.handle(req, res))
router.post('/logout', ensureAuthenticated, (req, res) => logoutUserController.handle(req, res))

export default router
