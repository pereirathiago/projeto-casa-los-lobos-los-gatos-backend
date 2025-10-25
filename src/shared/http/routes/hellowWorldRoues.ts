import { container } from '@shared/container/index.js'
import { HelloWorldController } from '@src/modules/common/controllers/HelloWorldController.js'
import { Router } from 'express'

const router = Router()
const helloWorldController = container.resolve(HelloWorldController)

router.get('/', (req, res) => helloWorldController.getHelloWorld(req, res))

export default router
