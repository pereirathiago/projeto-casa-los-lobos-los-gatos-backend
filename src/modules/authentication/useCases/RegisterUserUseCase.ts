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
      throw new AppError('Nome, e-mail e senha são obrigatórios!', 400)
    }

    // Validação de formato de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new AppError('Formato de e-mail inválido!', 400)
    }

    // Validação de senha (mínimo 6 caracteres)
    if (password.length < 6) {
      throw new AppError('A senha deve ter pelo menos 6 caracteres!', 400)
    }

    // Verificar se o e-mail já existe
    const userExists = await this.userRepository.findByEmail(email)

    if (userExists) {
      throw new AppError('Este e-mail já está em uso!', 409)
    }

    // Hash da senha
    const hashedPassword = await hash(password, 8)

    // Criar usuário com role 'sponsor' (padrinho)
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'sponsor',
    })

    // Retornar dados do usuário sem a senha
    return {
      id: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    }
  }
}
