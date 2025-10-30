import { Router } from 'express'
import authRoutes from './authRoutes.js'
import helloWorldRoutes from './hellowWorldRoues.js'

const router = Router()

router.use('/', authRoutes)
router.use('/hello-world', helloWorldRoutes)

export default router
