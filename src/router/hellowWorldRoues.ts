import { Router } from 'express'
import { container } from '../container/index.js'
import { HelloWorldController } from '../controllers/HelloWorldController.js'

const router = Router()
const helloWorldController = container.resolve(HelloWorldController)

router.get('/', (req, res) => helloWorldController.getHelloWorld(req, res))

export default router
