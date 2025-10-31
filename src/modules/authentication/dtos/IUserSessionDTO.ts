interface IAuthenticateUserDTO {
  email: string
  password: string
}

interface IAuthenticateUserResponse {
  token: string
  expires_in: number
  user: {
    id: string
    name: string
    email: string
    role: 'user' | 'admin'
  }
}

interface ICreateUserSessionDTO {
  user_id: string
  refresh_token: string
  expires_date: Date
}

export { IAuthenticateUserDTO, IAuthenticateUserResponse, ICreateUserSessionDTO }
