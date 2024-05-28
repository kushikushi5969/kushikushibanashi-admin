import { Prisma } from '@prisma/client'

export const mediaData: Prisma.mediaCreateInput[] = [
  {
    url: process.env.SEED_MEDIA_URL || '',
  },
]
