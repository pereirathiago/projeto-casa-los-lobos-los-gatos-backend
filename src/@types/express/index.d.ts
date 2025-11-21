declare namespace Express {
  export interface Request {
    user: {
      id?: number
      uuid?: string
      name?: string
      email?: string
      role?: 'sponsor' | 'admin'
      is_master?: boolean
      deleted?: boolean
      parent?: {
        uuid: string
        exp: number
      }
    }
  }
}
