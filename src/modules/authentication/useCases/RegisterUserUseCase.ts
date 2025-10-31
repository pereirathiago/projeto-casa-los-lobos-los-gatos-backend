import { AppError } from '@shared/errors/AppError.js'
import { hash } from 'bcrypt'
import { inject, injectable } from 'tsyringe'
import { IUserRepository } from '../repositories/interfaces/IUserRepository.js'
import { IRegisterUserDTO, IRegisterUserResponse } from '../repositories/interfaces/register.js'

@injectable()
export class RegisterUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute({ name, email, password }: IRegisterUserDTO): Promise<IRegisterUserResponse> {
    // Validação de dados de entrada
    if (!name || !email || !password) {
      throw new AppError('Name, email and password are required!', 400)
    }

    // Validação de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format!', 400)
    }

    // Validação de senha (mínimo 6 caracteres)
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters long!', 400)
    }

    // Verificar se o e-mail já existe
    const userExists = await this.userRepository.findByEmail(email)

    if (userExists) {
      throw new AppError('Email already in use!', 409)
    }

    // Hash da senha
    const hashedPassword = await hash(password, 8)

    // Criar usuário com role 'user' (padrinho)
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    })

    // Retornar dados do usuário sem a senha
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    }
  }
}
