import { ICreateSponsorshipDTO } from '../../dtos/ISponsorshipDTO.js'
import { ISponsorshipModel } from '../../models/ISponsorshipModel.js'

export interface ISponsorshipRepository {
  create(data: ICreateSponsorshipDTO): Promise<ISponsorshipModel>
  findByUserAndAnimal(userId: number, animalId: number): Promise<ISponsorshipModel | undefined>
}
