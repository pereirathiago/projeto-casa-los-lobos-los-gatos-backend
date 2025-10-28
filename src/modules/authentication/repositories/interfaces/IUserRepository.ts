import { IRegisterUserDTO } from '../../dtos/IUserDTO.js'
import { IUserModel } from '../../models/IUserModel.js'

interface IUserRepository {
  create(userData: IRegisterUserDTO): Promise<IUserModel>
}

export { IUserRepository }
