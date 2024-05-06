import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const rolesData: Prisma.roleCreateInput[] = [
  {
    name: 'admin',
  },
  {
    name: 'viewer',
  },
]

async function findRoleIdByName(name: string) {
  const foundRole = await prisma.role.findFirst({
    where: {
      name: name,
    },
  })
  if (!foundRole) {
    throw new Error(`Role ${name} not found`)
  }
  return foundRole.id
}

async function main() {
  console.log('Start seeding...')

  // roleの作成
  for (const role of rolesData) {
    const newRole = await prisma.role.create({
      data: role,
    })
    console.log(`Created role with id: ${newRole.id}`)
  }

  // ロールIDを取得
  const viewerRoleId = await findRoleIdByName('viewer')
  const usersData: Prisma.userCreateInput[] = [
    {
      name: 'Viewer',
      email: 'viewer@example.com',
      role: {
        connect: { id: viewerRoleId }, // ロールとの関連付け
      },
    },
  ]

  // userの作成
  for (const user of usersData) {
    const newUser = await prisma.user.create({
      data: user,
    })
    console.log(`Created user with id: ${newUser.id}`)
  }

  console.log('Seeded data successfully')
}

main()
  .catch((e) => {
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
