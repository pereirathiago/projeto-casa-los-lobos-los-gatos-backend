import * as Yup from 'yup'
import { IAuthenticateUserDTO } from '../../dtos/IUserSessionDTO.js'

const loginValidationSchema: Yup.ObjectSchema<IAuthenticateUserDTO> = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email format')
    .lowercase()
    .trim(),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

export { loginValidationSchema }
