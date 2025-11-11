declare namespace Express {
  export interface Request {
    user: {
      id?: number
      uuid?: string
      name?: string
      email?: string
      role?: 'sponsor' | 'admin'
      parent?: {
        uuid: string
        exp: number
      }
    }
  }
}
