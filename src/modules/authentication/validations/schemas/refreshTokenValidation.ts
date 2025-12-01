import * as Yup from 'yup'
import { IRefreshTokenDTO } from '../../dtos/IUserSessionDTO.js'

export const refreshTokenValidationSchema: Yup.ObjectSchema<IRefreshTokenDTO> = Yup.object().shape({
  refreshToken: Yup.string()
    .required('Refresh token é obrigatório')
    .min(10, 'Formato de refresh token inválido'),
})
