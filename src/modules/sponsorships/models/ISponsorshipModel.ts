export interface ISponsorshipModel {
  id: number
  uuid: string
  user_id: number
  animal_id: number
  monthly_amount: number
  active: boolean
  deleted: boolean
  created_at: Date
  updated_at: Date
}

export interface ISponsorshipWithDetailsModel {
  uuid: string
  monthly_amount: number
  active: boolean
  created_at: Date
  updated_at: Date
  user_uuid: string
  user_name: string
  user_email: string
  animal_uuid: string
  animal_name: string
  animal_type: string
  animal_breed: string
}
