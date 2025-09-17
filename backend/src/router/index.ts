import { Router } from 'express'
import helloWorldRoutes from './hellowWorldRoues'

const router = Router()

router.use('/hello-world', helloWorldRoutes)

export default router
