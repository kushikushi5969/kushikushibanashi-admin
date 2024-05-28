import prisma from '@/app/lib/prisma'
import { GetListResponse } from '@refinedev/core'
import { FindManyPostParams, PostData } from '../../types/api/posts'

export class Post {
  postId?: number
  title: string
  content: string
  categoryId: number
  thumbnailId?: number | null
  authorId: number
  createdAt?: Date
  updatedAt?: Date

  constructor(data: PostData) {
    this.postId = data.id
    this.title = data.title
    this.content = data.content
    this.categoryId = data.category_id
    this.thumbnailId = data.thumbnail_id
    this.authorId = data.author_id
  }
  update(title: string, content: string, categoryId: number, thumbnailId: number) {
    if (title.length > 200) {
      throw new Error('Title length is too long')
    }
    this.title = title
    this.content = content
    this.categoryId = categoryId
    this.thumbnailId = thumbnailId
    this.updatedAt = new Date()
  }
  async register() {
    const data = await prisma.post.create({
      data: {
        title: this.title,
        content: this.content,
        category_id: this.categoryId,
        thumbnail_id: this.thumbnailId,
        author_id: this.authorId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })
    return new Post(data)
  }
}

export class PostUtil {
  async update(post: Post): Promise<Post> {
    const data = await prisma.post.update({
      where: {
        id: post.postId,
      },
      data: {
        title: post.title,
        content: post.content,
        category_id: post.categoryId,
        thumbnail_id: post.thumbnailId,
        updated_at: new Date(),
      },
    })
    return new Post(data)
  }

  async delete(id: number) {
    await prisma.post.delete({
      where: {
        id,
      },
    })
  }

  static async findById(id: number): Promise<Post | null> {
    const data = await prisma.post.findUnique({
      where: {
        id,
      },
    })
    if (!data) {
      return null
    }
    return new Post(data)
  }

  async findMany(prop: FindManyPostParams): Promise<GetListResponse> {
    let queryOptions = {}
    queryOptions = {
      ...prop,
    }
    const data = await prisma.post.findMany({
      ...queryOptions,
      include: {
        category: true,
      },
    })
    const queryToCount = prop.where ? prop.where : {}
    const total = await prisma.post.count({ where: queryToCount })
    return { data, total }
  }
}
