import * as Yup from 'yup'
import { IRefreshTokenDTO } from '../../dtos/IUserSessionDTO.js'

export const refreshTokenValidationSchema: Yup.ObjectSchema<IRefreshTokenDTO> = Yup.object().shape({
  refreshToken: Yup.string()
    .required('Refresh token is required')
    .min(10, 'Invalid refresh token format'),
})
