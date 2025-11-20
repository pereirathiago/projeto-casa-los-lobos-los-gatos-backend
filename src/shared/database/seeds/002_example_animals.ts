import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  // Deletar dados existentes (em ordem devido a foreign keys)
  await knex('animal_tags').del()
  await knex('animal_photos').del()
  await knex('animals').del()

  // Inserir animais de exemplo
  const animals = await knex('animals')
    .insert([
      {
        name: 'Rex',
        type: 'dog',
        breed: 'Labrador',
        age: 3.0,
        description:
          'Rex é um cachorro muito amigável e brincalhão que adora correr no parque e fazer novos amigos. Ele é perfeito para famílias ativas.',
      },
      {
        name: 'Luna',
        type: 'cat',
        breed: 'Persa',
        age: 2.5,
        description:
          'Luna é uma gatinha calma e carinhosa que adora dormir no sofá e receber carinho. Ela é ideal para quem busca um pet tranquilo.',
      },
      {
        name: 'Max',
        type: 'dog',
        breed: 'Pastor Alemão',
        age: 5.0,
        description:
          'Max é um cão leal e protetor, muito inteligente e obediente. Ele já teve treinamento básico e se dá bem com crianças maiores.',
      },
    ])
    .returning('id')

  // Inserir fotos para cada animal
  await knex('animal_photos').insert([
    // Fotos do Rex
    {
      animal_id: animals[0].id,
      photo_url: '/tmp/animals/example-dog-1.jpg',
      order_index: 0,
    },
    {
      animal_id: animals[0].id,
      photo_url: '/tmp/animals/example-dog-1-2.jpg',
      order_index: 1,
    },
    // Fotos da Luna
    {
      animal_id: animals[1].id,
      photo_url: '/tmp/animals/example-cat-1.jpg',
      order_index: 0,
    },
    {
      animal_id: animals[1].id,
      photo_url: '/tmp/animals/example-cat-1-2.jpg',
      order_index: 1,
    },
    {
      animal_id: animals[1].id,
      photo_url: '/tmp/animals/example-cat-1-3.jpg',
      order_index: 2,
    },
    // Fotos do Max
    {
      animal_id: animals[2].id,
      photo_url: '/tmp/animals/example-dog-2.jpg',
      order_index: 0,
    },
  ])

  // Inserir tags para cada animal
  await knex('animal_tags').insert([
    // Tags do Rex
    { animal_id: animals[0].id, label: 'Brincalhão', color: '#6645a0' },
    { animal_id: animals[0].id, label: 'Saudável', color: '#10b981' },
    { animal_id: animals[0].id, label: 'Sociável', color: '#3b82f6' },
    // Tags da Luna
    { animal_id: animals[1].id, label: 'Calma', color: '#6b7280' },
    { animal_id: animals[1].id, label: 'Carinhosa', color: '#ec4899' },
    // Tags do Max
    { animal_id: animals[2].id, label: 'Treinado', color: '#10b981' },
    { animal_id: animals[2].id, label: 'Protetor', color: '#cd6b16' },
    { animal_id: animals[2].id, label: 'Inteligente', color: '#f59e0b' },
  ])
}
