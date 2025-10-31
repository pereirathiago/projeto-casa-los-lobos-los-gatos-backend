interface IUserModel {
  id: string
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  active: boolean
  created_at: Date
  updated_at: Date
}

export { IUserModel }
