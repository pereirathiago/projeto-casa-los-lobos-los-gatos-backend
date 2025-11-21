interface IUserModel {
  id: number
  uuid: string
  name: string
  email: string
  password: string
  role: 'sponsor' | 'admin'
  is_master: boolean
  active: boolean
  created_at: Date
  updated_at: Date
}

export { IUserModel }
