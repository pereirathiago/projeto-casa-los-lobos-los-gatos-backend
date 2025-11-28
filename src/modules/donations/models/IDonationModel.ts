export interface IDonationModel {
  id: number
  uuid: string
  user_id: number
  amount: number
  donation_date: Date
  status: 'pending' | 'confirmed'
  confirmed_by: number | null
  confirmed_at: Date | null
  notes: string | null
  deleted: boolean
  created_at: Date
  updated_at: Date
}

export interface IDonationWithDetailsModel {
  uuid: string
  amount: number
  donation_date: Date
  status: 'pending' | 'confirmed'
  notes: string | null
  confirmed_at: Date | null
  created_at: Date
  user_uuid: string
  user_name: string
  user_email: string
  confirmed_by_uuid: string | null
  confirmed_by_name: string | null
}
