interface IAnimalTagDTO {
  id: string
  label: string
  color: string
}

interface ICreateAnimalDTO {
  name: string
  type: 'dog' | 'cat'
  breed: string
  age: number
  description: string
  tags?: IAnimalTagDTO[]
}

interface IUpdateAnimalDTO {
  name?: string
  type?: 'dog' | 'cat'
  breed?: string
  age?: number
  description?: string
  tags?: IAnimalTagDTO[]
}

interface IAnimalPhotoDTO {
  id: number
  uuid: string
  animal_id: number
  photo_url: string
  order_index: number
  created_at: Date
}

interface IAnimalResponseDTO {
  id: number
  uuid: string
  name: string
  type: 'dog' | 'cat'
  breed: string
  age: number
  description: string
  active: boolean
  photos?: IAnimalPhotoDTO[]
  tags?: IAnimalTagDTO[]
  slug: string
  created_at: Date
  updated_at: Date
}

export { IAnimalPhotoDTO, IAnimalResponseDTO, IAnimalTagDTO, ICreateAnimalDTO, IUpdateAnimalDTO }
