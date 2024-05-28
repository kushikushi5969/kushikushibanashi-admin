import prisma from '@app/lib/prisma'
import { FindManyMediaParams, MediaData } from '../../types/api/media'
import { GetListResponse } from '@refinedev/core'

export class Media {
  mediaId?: number
  mediaUrl: string
  createdAt?: Date
  updatedAt?: Date

  constructor(data: MediaData) {
    this.mediaId = data.id
    this.mediaUrl = data.url
  }
  async register() {
    const data = await prisma.media.create({
      data: {
        url: this.mediaUrl,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })
    return new Media(data)
  }
}

export class MediaUtil {
  static async findById(id: number): Promise<Media | null> {
    const data = await prisma.media.findUnique({
      where: {
        id,
      },
    })
    if (!data) {
      return null
    }
    return new Media(data)
  }

  async findMany(prop: FindManyMediaParams): Promise<GetListResponse> {
    let queryOptions = {}
    queryOptions = {
      ...prop,
    }
    const data = await prisma.media.findMany({
      ...queryOptions,
    })
    const queryToCount = prop.where ? prop.where : {}
    const total = await prisma.media.count({
      where: queryToCount,
    })
    return { data, total }
  }
}
