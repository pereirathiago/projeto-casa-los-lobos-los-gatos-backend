import { ICreateAnimalDTO } from '@modules/animals/dtos/IAnimalDTO.js'
import { IAnimalModel } from '@modules/animals/models/IAnimalModel.js'
import { IAnimalRepository } from '@modules/animals/repositories/interfaces/IAnimalRepository.js'
import { Knex } from 'knex'
import { inject, injectable } from 'tsyringe'

@injectable()
class AnimalRepository implements IAnimalRepository {
  constructor(@inject('KnexConnection') private db: Knex) {}

  async create(animalData: ICreateAnimalDTO, trx?: Knex.Transaction): Promise<IAnimalModel> {
    const connection = trx || this.db

    const [animal] = await connection<IAnimalModel>('animals')
      .insert({
        name: animalData.name,
        type: animalData.type,
        breed: animalData.breed,
        age: animalData.age,
        description: animalData.description,
        active: true,
      })
      .returning('*')

    return animal
  }

  async findById(id: number, trx?: Knex.Transaction): Promise<IAnimalModel | null> {
    const connection = trx || this.db

    const animal = await connection<IAnimalModel>('animals').where({ id, active: true }).first()

    return animal || null
  }

  async findByUuid(uuid: string, trx?: Knex.Transaction): Promise<IAnimalModel | null> {
    const connection = trx || this.db

    const animal = await connection<IAnimalModel>('animals').where({ uuid, active: true }).first()

    return animal || null
  }

  async findAll(
    filters?: {
      type?: 'dog' | 'cat'
      breed?: string
      minAge?: number
      maxAge?: number
    },
    trx?: Knex.Transaction,
  ): Promise<IAnimalModel[]> {
    const connection = trx || this.db

    let query = connection<IAnimalModel>('animals').select('*').where({ active: true })

    if (filters?.type) {
      query = query.where({ type: filters.type })
    }

    if (filters?.breed) {
      query = query.where('breed', 'ilike', `%${filters.breed}%`)
    }

    if (filters?.minAge !== undefined) {
      query = query.where('age', '>=', filters.minAge)
    }

    if (filters?.maxAge !== undefined) {
      query = query.where('age', '<=', filters.maxAge)
    }

    const animals = await query.orderBy('created_at', 'desc')

    return animals
  }

  async update(
    id: number,
    animalData: Partial<IAnimalModel>,
    trx?: Knex.Transaction,
  ): Promise<IAnimalModel> {
    const connection = trx || this.db

    const [animal] = await connection<IAnimalModel>('animals')
      .where({ id })
      .update({
        ...animalData,
        updated_at: connection.fn.now(),
      })
      .returning('*')

    return animal
  }

  async delete(id: number, trx?: Knex.Transaction): Promise<void> {
    const connection = trx || this.db

    await connection<IAnimalModel>('animals').where({ id }).update({
      active: false,
      updated_at: connection.fn.now(),
    })
  }
}

export { AnimalRepository }
