import { IAnimalTagModel } from '@modules/animals/models/IAnimalTagModel.js'
import { IAnimalTagRepository } from '@modules/animals/repositories/interfaces/IAnimalTagRepository.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

@injectable()
class AnimalTagRepository implements IAnimalTagRepository {
  constructor(@inject('KnexConnection') private db: Knex) {}

  async create(
    animalId: number,
    label: string,
    color: string,
    trx?: Knex.Transaction,
  ): Promise<IAnimalTagModel> {
    const connection = trx || this.db

    const [tag] = await connection<IAnimalTagModel>('animal_tags')
      .insert({
        animal_id: animalId,
        label,
        color,
      })
      .returning('*')

    return tag
  }

  async createMany(
    animalId: number,
    tags: Array<{ label: string; color: string }>,
    trx?: Knex.Transaction,
  ): Promise<IAnimalTagModel[]> {
    const connection = trx || this.db

    const tagsToInsert = tags.map((tag) => ({
      animal_id: animalId,
      label: tag.label,
      color: tag.color,
    }))

    const createdTags = await connection<IAnimalTagModel>('animal_tags')
      .insert(tagsToInsert)
      .returning('*')

    return createdTags
  }

  async findByAnimalId(animalId: number, trx?: Knex.Transaction): Promise<IAnimalTagModel[]> {
    const connection = trx || this.db

    const tags = await connection<IAnimalTagModel>('animal_tags')
      .where({ animal_id: animalId })
      .orderBy('created_at', 'asc')

    return tags
  }

  async deleteByAnimalId(animalId: number, trx?: Knex.Transaction): Promise<void> {
    const connection = trx || this.db

    await connection<IAnimalTagModel>('animal_tags').where({ animal_id: animalId }).delete()
  }

  async delete(id: number, trx?: Knex.Transaction): Promise<void> {
    const connection = trx || this.db

    await connection<IAnimalTagModel>('animal_tags').where({ id }).delete()
  }
}

export { AnimalTagRepository }
