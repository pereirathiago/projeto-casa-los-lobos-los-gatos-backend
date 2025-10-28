interface IUserModel {
  id: number
  name: string
  email: string
  password: string
  role: 'sponsor' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export { IUserModel }
