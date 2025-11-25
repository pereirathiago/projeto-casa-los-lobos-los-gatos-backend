export interface ICreateDonationDTO {
  userId: number
  amount: number
  donationDate: Date
  notes?: string
}

export interface IConfirmDonationDTO {
  confirmedBy: number
}

export interface IDonationResponseDTO {
  uuid: string
  amount: number
  donationDate: Date
  status: 'pending' | 'confirmed'
  notes: string | null
  confirmedAt: Date | null
  createdAt: Date
  user: {
    uuid: string
    name: string
    email: string
  }
  confirmedBy: {
    uuid: string
    name: string
  } | null
}

export interface IMyDonationResponseDTO {
  uuid: string
  amount: number
  donationDate: Date
  status: 'pending' | 'confirmed'
  notes: string | null
  confirmedAt: Date | null
  createdAt: Date
}
