export interface IRegisterUserDTO {
  name: string
  email: string
  password: string
}

export interface IRegisterUserResponse {
  id: string
  name: string
  email: string
  role: string
  created_at: Date
}
