interface IAuthenticateUserDTO {
  email: string
  password: string
}

interface IAuthenticateUserResponse {
  token: string
  expires_in: number
  refreshToken: string
  user: {
    id: string
    name: string
    email: string
    role: 'sponsor' | 'admin'
  }
}

interface ICreateUserSessionDTO {
  user_id: number
  refresh_token: string
  expires_date: Date
}

interface IAccessTokenPayload {
  sub: string
  email: string
  role: string
  version: string
  parent?: {
    uuid: string
    exp: number
  }
}

interface IRefreshTokenDTO {
  refreshToken: string
}

interface IRefreshTokenResponse {
  token: string
  expires_in: number
}

export {
  IAccessTokenPayload,
  IAuthenticateUserDTO,
  IAuthenticateUserResponse,
  ICreateUserSessionDTO,
  IRefreshTokenDTO,
  IRefreshTokenResponse,
}
