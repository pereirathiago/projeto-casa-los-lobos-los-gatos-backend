export interface UserSessionModel {
  id: string
  user_id: string
  refresh_token: string
  expires_date: Date
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateUserSessionModel {
  user_id: string
  refresh_token: string
  expires_date: Date
}

export interface UpdateUserSessionModel {
  is_active?: boolean
}
