export interface IAuthenticateUserRequest {
  email: string
  password: string
}

export interface ILogoutUserRequest {
  userId: string
  refreshToken: string
}

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  active: boolean
  created_at: Date
  updated_at: Date
}

export interface IUserSession {
  id: string
  user_id: string
  refresh_token: string
  expires_date: Date
  is_active: boolean
  created_at: Date
  updated_at: Date
}
