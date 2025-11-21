interface IUserModel {
  id: number
  uuid: string
  name: string
  email: string
  password: string
  role: 'sponsor' | 'admin'
  active: boolean
  created_at: Date
  updated_at: Date
}

export { IUserModel }
