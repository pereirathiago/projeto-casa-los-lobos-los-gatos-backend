import { Router } from 'express'
import adminRoutes from './adminRoutes.js'
import animalRoutes from './animalRoutes.js'
import authRoutes from './authRoutes.js'
import helloWorldRoutes from './hellowWorldRoues.js'

const router = Router()

router.use('/', authRoutes)
router.use('/admins', adminRoutes)
router.use('/animals', animalRoutes)
router.use('/hello-world', helloWorldRoutes)

export default router
