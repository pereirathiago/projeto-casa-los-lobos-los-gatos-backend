import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { IRegisterUserDTO } from '../repositories/interfaces/register.js'
import { RegisterUserUseCase } from '../useCases/RegisterUserUseCase.js'

export class RegisterUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const data = req.body as IRegisterUserDTO

    const registerUserUseCase = container.resolve(RegisterUserUseCase)

    const user = await registerUserUseCase.execute(data)

    return res.status(201).json({
      message: 'User registered successfully!',
      user: user,
    })
  }
}
