import { Prisma } from '@prisma/client'

export const rolesData: Prisma.roleCreateInput[] = [
  {
    name: 'admin',
  },
  {
    name: 'viewer',
  },
]
