import { ICreateDonationInternalDTO } from '../../dtos/IDonationDTO.js'
import { IDonationModel, IDonationWithDetailsModel } from '../../models/IDonationModel.js'

export interface IDonationRepository {
  create(data: ICreateDonationInternalDTO): Promise<IDonationModel>
  findAll(): Promise<IDonationModel[]>
  findAllWithDetails(): Promise<IDonationWithDetailsModel[]>
  findByUuid(uuid: string): Promise<IDonationModel | null>
  findByUuidWithDetails(uuid: string): Promise<IDonationWithDetailsModel | null>
  findBySponsorId(userId: number): Promise<IDonationModel[]>
  findBySponsorIdWithDetails(userId: number): Promise<IDonationWithDetailsModel[]>
  confirmDonation(uuid: string, confirmedBy: number, confirmedAt: Date): Promise<void>
  softDelete(uuid: string): Promise<void>
}
