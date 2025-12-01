import * as Yup from 'yup'
import { IAuthenticateUserDTO } from '../../dtos/IUserSessionDTO.js'

const loginValidationSchema: Yup.ObjectSchema<IAuthenticateUserDTO> = Yup.object().shape({
  email: Yup.string()
    .required('Email é obrigatório')
    .email('Formato de email inválido')
    .lowercase()
    .trim(),
  password: Yup.string()
    .required('Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export { loginValidationSchema }
