export interface ISponsorshipModel {
  id: number
  uuid: string
  user_id: number
  animal_id: number
  active: boolean
  deleted: boolean
  created_at: Date
  updated_at: Date
}

export interface ISponsorshipWithDetailsModel {
  uuid: string
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

export interface ISponsorshipWithAnimalDetailsModel {
  sponsorship_uuid: string
  active: boolean
  sponsored_since: Date
  animal_id: number
  animal_uuid: string
  animal_name: string
  animal_type: string
  animal_breed: string
  animal_age: number
  animal_description: string
  photo_url: string | null
  tag_label: string | null
  tag_color: string | null
}
