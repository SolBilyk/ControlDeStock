import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Sucursales iniciales
  const branch1 = await prisma.branch.upsert({
    where: { id: 'seed-branch-1' },
    update: {},
    create: { id: 'seed-branch-1', name: 'Sucursal Centro', address: 'Principal 123', active: true },
  })
  const branch2 = await prisma.branch.upsert({
    where: { id: 'seed-branch-2' },
    update: {},
    create: { id: 'seed-branch-2', name: 'Sucursal Norte', address: 'Avenida 456', active: true },
  })

  // Usuario admin inicial
  const password = 'Admin123!'
  const hash = await bcrypt.hash(password, 10)
  await prisma.user.upsert({
    where: { email: 'admin@local.test' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@local.test',
      passwordHash: hash,
      role: Role.ADMIN,
      branchId: branch1.id,
    },
  })

  console.log('Seed completado:')
  console.log('- Sucursales creadas:', branch1.name, ',', branch2.name)
  console.log('- Usuario admin: admin@local.test /', password)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
