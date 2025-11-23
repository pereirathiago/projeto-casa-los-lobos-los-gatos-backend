import { ICreateSponsorshipDTO } from '../../dtos/ISponsorshipDTO.js'
import { ISponsorshipModel, ISponsorshipWithDetailsModel } from '../../models/ISponsorshipModel.js'

export interface ISponsorshipRepository {
  create(data: ICreateSponsorshipDTO): Promise<ISponsorshipModel>
  findAll(): Promise<ISponsorshipModel[]>
  findAllWithDetails(): Promise<ISponsorshipWithDetailsModel[]>
  findByUuid(uuid: string): Promise<ISponsorshipModel | undefined>
  findByUuidWithDetails(uuid: string): Promise<ISponsorshipWithDetailsModel | undefined>
  findById(id: number): Promise<ISponsorshipModel | undefined>
  findByUserAndAnimal(userId: number, animalId: number): Promise<ISponsorshipModel | undefined>
}
