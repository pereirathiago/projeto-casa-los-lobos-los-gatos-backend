import { hash } from 'bcrypt'
import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  const masterAdminPassword = await hash('123456', 8)
  const adminPassword = await hash('admin123', 8)
  const userPassword = await hash('user123', 8)

  // Inserts seed entries
  await knex('users').insert([
    {
      name: 'Master Admin',
      email: 'masteradmin@test.com',
      password: masterAdminPassword,
      role: 'admin',
      is_master: true,
      active: true,
      deleted: false,
    },
    {
      name: 'Admin User',
      email: 'admin@test.com',
      password: adminPassword,
      role: 'admin',
      is_master: false,
      active: true,
      deleted: false,
    },
    {
      name: 'Regular User',
      email: 'user@test.com',
      password: userPassword,
      role: 'sponsor',
      is_master: false,
      active: true,
      deleted: false,
    },
  ])

  console.log('Usuários de teste criados com sucesso!')
  console.log('Master Admin: masteradmin@test.com | Senha: 123456')
  console.log('Admin: admin@test.com | Senha: admin123')
  console.log('User: user@test.com | Senha: user123')
}
