export interface ICreateSponsorDTO {
  name: string
  email: string
  password: string
}

export interface IUpdateSponsorDTO {
  name?: string
  email?: string
  password?: string
  active?: boolean
}

export interface ISponsorResponseDTO {
  uuid: string
  name: string
  email: string
  role: string
  active: boolean
  deleted: boolean
  created_at: Date
  updated_at: Date
}
