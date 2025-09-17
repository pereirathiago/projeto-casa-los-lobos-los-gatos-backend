import { Router } from 'express'
import { container } from '../container'
import { HelloWorldController } from '../controllers/HelloWorldController'

const router = Router()
const helloWorldController = container.resolve(HelloWorldController)

router.get('/', (req, res) => helloWorldController.getHelloWorld(req, res))

export default router
