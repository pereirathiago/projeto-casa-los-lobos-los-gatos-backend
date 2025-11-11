interface UserSessionModel {
  id: string
  user_id: number
  refresh_token: string
  expires_date: Date
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export { UserSessionModel }
