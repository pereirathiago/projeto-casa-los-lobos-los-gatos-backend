import { GetHelloWorldUseCase } from '@modules/common/useCases/HelloWorld/GetHelloWorldUseCase.js'
import { Request, Response } from 'express'
import { container, injectable } from 'tsyringe'

@injectable()
class HelloWorldController {
  async getHelloWorld(req: Request, res: Response): Promise<Response> {
    const getHelloWorldUseCase = container.resolve(GetHelloWorldUseCase)

    const message = await getHelloWorldUseCase.execute()

    return res.status(200).json({ message })
  }
}

export { HelloWorldController }
