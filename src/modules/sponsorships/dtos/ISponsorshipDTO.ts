export interface ICreateSponsorshipDTO {
  userId: number
  animalId: number
}

export interface IUpdateSponsorshipDTO {
  animalId?: number
  active?: boolean
}

export interface ISponsorshipResponseDTO {
  uuid: string
  user: {
    uuid: string
    name: string
    email: string
  }
  animal: {
    uuid: string
    name: string
    type: string
    breed: string
  }
  active: boolean
  date: Date
}
