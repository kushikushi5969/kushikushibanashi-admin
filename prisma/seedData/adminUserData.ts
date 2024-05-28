import { Prisma } from '@prisma/client'

export const adminUserData = [
  {
    name: process.env.SEED_USER_NAME || '',
    email: process.env.SEED_USER_EMAIL || '',
  },
]
