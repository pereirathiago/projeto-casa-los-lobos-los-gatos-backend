import { hash } from 'bcrypt'
import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  const adminPassword = await hash('admin123', 8)
  const userPassword = await hash('user123', 8)

  // Inserts seed entries
  await knex('users').insert([
    {
      name: 'Admin User',
      email: 'admin@test.com',
      password: adminPassword,
      role: 'admin',
      active: true,
    },
    {
      name: 'Regular User',
      email: 'user@test.com',
      password: userPassword,
      role: 'user',
      active: true,
    },
  ])

  console.log('✅ Test users created successfully!')
  console.log('📧 Admin: admin@test.com | Password: admin123')
  console.log('📧 User: user@test.com | Password: user123')
}
