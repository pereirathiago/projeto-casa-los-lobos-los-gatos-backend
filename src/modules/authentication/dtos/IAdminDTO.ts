export interface ICreateAdminDTO {
  name: string
  email: string
  password: string
}

export interface IUpdateAdminDTO {
  name?: string
  email?: string
  password?: string
  active?: boolean
}

export interface IAdminResponseDTO {
  id: number
  uuid: string
  name: string
  email: string
  role: string
  active: boolean
  created_at: Date
  updated_at: Date
}
