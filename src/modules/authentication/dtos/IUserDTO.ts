interface IRegisterUserDTO {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
}

export { IRegisterUserDTO }
