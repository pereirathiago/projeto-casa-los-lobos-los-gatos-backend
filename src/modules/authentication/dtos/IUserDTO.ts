interface IRegisterUserDTO {
  name: string
  email: string
  password: string
  role: 'sponsor' | 'admin'
}

export { IRegisterUserDTO }
