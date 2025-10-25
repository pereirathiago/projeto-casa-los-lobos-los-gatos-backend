import { Router } from 'express'
import authRoutes from './authRoutes.js'
import helloWorldRoutes from './hellowWorldRoues.js'

const router = Router()

router.use('/hello-world', helloWorldRoutes)
router.use('/auth', authRoutes)

export default router
