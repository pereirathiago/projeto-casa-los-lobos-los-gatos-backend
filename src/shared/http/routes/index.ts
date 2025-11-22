import { Router } from 'express'
import adminRoutes from './adminRoutes.js'
import adminSponsorRouter from './adminSponsorRoutes.js'
import animalRoutes from './animalRoutes.js'
import authRoutes from './authRoutes.js'
import helloWorldRoutes from './hellowWorldRoues.js'
import sponsorRoutes from './sponsorRoutes.js'

const router = Router()

router.use('/', authRoutes)
router.use('/animals', animalRoutes)
router.use('/admin', adminRoutes)
router.use('/users', sponsorRoutes)
router.use('/admin/sponsors', adminSponsorRouter)
router.use('/hello-world', helloWorldRoutes)

export default router
