import { HelloWorldModel } from '../models/HelloWorldModel.js'
import { injectable } from 'tsyringe'

export interface IHelloWorldRepository {
  getHelloMessage(): HelloWorldModel
}

@injectable()
export class HelloWorldRepository implements IHelloWorldRepository {
  getHelloMessage(): HelloWorldModel {
    return {
      message: 'Hello, World!',
    }
  }
}
