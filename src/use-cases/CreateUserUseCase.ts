import { hash } from 'bcrypt'
import { inject, injectable } from 'tsyringe'
import { IUserRepository } from '../repositories/UserRepository'
import { AppError } from '../shared/errors/AppError'
import { CreateUserModel, UserModel } from '../models/UserModel'

interface ICreateUserRequest extends CreateUserModel {}

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute({ name, email, password, role = 'user' }: ICreateUserRequest): Promise<UserModel> {
    // Check if user already exists
    const userExists = await this.userRepository.findByEmail(email)

    if (userExists) {
      throw new AppError('User already exists with this email!', 409)
    }

    // Hash password
    const hashedPassword = await hash(password, 8)

    // Create user
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    return user
  }
}
