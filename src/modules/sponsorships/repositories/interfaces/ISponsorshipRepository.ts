import { ICreateSponsorshipDTO, IUpdateSponsorshipDTO } from '../../dtos/ISponsorshipDTO.js'
import {
  ISponsorshipModel,
  ISponsorshipWithAnimalDetailsModel,
  ISponsorshipWithDetailsModel,
} from '../../models/ISponsorshipModel.js'

export interface ISponsorshipRepository {
  create(data: ICreateSponsorshipDTO): Promise<ISponsorshipModel>
  findAll(): Promise<ISponsorshipModel[]>
  findAllWithDetails(): Promise<ISponsorshipWithDetailsModel[]>
  findByUuid(uuid: string): Promise<ISponsorshipModel | undefined>
  findByUuidWithDetails(uuid: string): Promise<ISponsorshipWithDetailsModel | undefined>
  findById(id: number): Promise<ISponsorshipModel | undefined>
  findByUserAndAnimal(userId: number, animalId: number): Promise<ISponsorshipModel | undefined>
  findAllByUserId(userId: number): Promise<ISponsorshipWithDetailsModel[]>
  findAllByUserIdWithAnimalDetails(userId: number): Promise<ISponsorshipWithAnimalDetailsModel[]>
  update(id: number, data: IUpdateSponsorshipDTO): Promise<ISponsorshipModel>
  softDelete(id: number): Promise<void>
}
