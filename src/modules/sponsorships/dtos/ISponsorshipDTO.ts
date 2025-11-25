export interface ICreateSponsorshipDTO {
  userId: number
  animalId: number
  monthlyAmount: number
}

export interface IUpdateSponsorshipDTO {
  animalId?: number
  monthlyAmount?: number
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
  monthlyAmount: number
  active: boolean
  date: Date
}
