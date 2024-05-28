import prisma from '@/app/lib/prisma'
import { CategoryData, FindManyCategoryParams } from '../../types/api/category'
import { GetListResponse } from '@refinedev/core'

export class Category {
  categoryId?: number
  categoryName: string
  createdAt?: Date
  updatedAt?: Date

  constructor(data: CategoryData) {
    this.categoryId = data.id
    this.categoryName = data.name
  }
  update(name: string) {
    if (name.length > 50) {
      throw new Error('Name length is too long')
    }
    this.categoryName = name
    this.updatedAt = new Date()
  }
  async register() {
    const data = await prisma.category.create({
      data: {
        name: this.categoryName,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })
    return new Category(data)
  }
}

export class CategoryUtil {
  async create(category: Category): Promise<Category> {
    if (category.categoryName.length > 50) {
      throw new Error('Name length is too long')
    }
    const data = await prisma.category.create({
      data: {
        name: category.categoryName,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })
    return new Category(data)
  }

  async update(category: Category): Promise<Category> {
    const data = await prisma.category.update({
      where: {
        id: category.categoryId,
      },
      data: {
        name: category.categoryName,
        updated_at: new Date(),
      },
    })
    return new Category(data)
  }

  async delete(id: number) {
    await prisma.category.delete({
      where: {
        id,
      },
    })
  }

  static async findById(id: number): Promise<Category | null> {
    const data = await prisma.category.findUnique({
      where: {
        id,
      },
    })
    if (!data) {
      return null
    }
    return new Category(data)
  }

  async findMany(prop: FindManyCategoryParams): Promise<GetListResponse> {
    let queryOptions = {}
    queryOptions = {
      ...prop,
    }
    const data = await prisma.category.findMany({
      ...queryOptions,
    })
    const queryToCount = prop.where ? prop.where : {}
    const total = await prisma.category.count({ where: queryToCount })
    return { data, total }
  }
}
