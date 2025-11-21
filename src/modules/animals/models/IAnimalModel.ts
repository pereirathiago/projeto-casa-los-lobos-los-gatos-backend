interface IAnimalModel {
  id: number
  uuid: string
  name: string
  type: 'dog' | 'cat'
  breed: string
  age: number
  description: string
  photo_url: string | null
  active: boolean
  created_at: Date
  updated_at: Date
}

export { IAnimalModel }
