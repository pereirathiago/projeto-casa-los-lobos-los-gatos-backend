import { Router } from 'express'
import helloWorldRoutes from './hellowWorldRoues'
import authRoutes from './authRoutes'

const router = Router()

router.use('/hello-world', helloWorldRoutes)
router.use('/auth', authRoutes)

export default router
