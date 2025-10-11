export interface UserModel {
  id: string
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  active: boolean
  created_at: Date
  updated_at: Date
}

export interface CreateUserModel {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin'
}

export interface UpdateUserModel {
  name?: string
  email?: string
  password?: string
  role?: 'user' | 'admin'
  active?: boolean
}
