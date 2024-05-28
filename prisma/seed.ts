import { PrismaClient, Prisma } from '@prisma/client'
import { adminUserData } from './seedData/adminUserData'
import { categoryData } from './seedData/categoryData'
import { mediaData } from './seedData/mediaData'
import { rolesData } from './seedData/rolesData'

const prisma = new PrismaClient()

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

  // categoryの作成
  for (const category of categoryData) {
    const newCategory = await prisma.category.create({
      data: category,
    })
    console.log(`Created category with id: ${newCategory.id}`)
  }

  // メディアの作成
  for (const media of mediaData) {
    const newMedia = await prisma.media.create({
      data: media,
    })
    console.log(`Created media with id: ${newMedia.id}`)
  }

  // ロールIDを取得
  const adminRoleId = await findRoleIdByName('admin')
  const viewerRoleId = await findRoleIdByName('viewer')

  const usersData: Prisma.userCreateInput[] = [
    {
      name: adminUserData[0].name,
      email: adminUserData[0].email,
      role: {
        connect: { id: adminRoleId }, // ロールとの関連付け
      },
    },
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
