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
    role: 'user' | 'admin'
  }
}

interface ICreateUserSessionDTO {
  user_id: number
  refresh_token: string
  expires_date: Date
}

export { IAuthenticateUserDTO, IAuthenticateUserResponse, ICreateUserSessionDTO }
