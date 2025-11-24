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

export interface IMySponsorshipResponseDTO {
  uuid: string
  animal: {
    uuid: string
    name: string
    type: string
    breed: string
    age: number
    description: string
    photo: string | null
    tags: Array<{
      label: string
      color: string
    }>
  }
  active: boolean
  sponsoredSince: Date
}
