import prisma from '@/app/lib/prisma'
import { CategoryData, FindManyCategoryParams, GetCategoryListResponse } from '../../types/api/category'
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
    if (name.length > 200) {
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
  async findMany(prop: FindManyCategoryParams): Promise<GetListResponse | GetCategoryListResponse[]> {
    if (Object.keys(prop).length === 0) {
      const data = await prisma.category.findMany({
        select: {
          id: true,
          name: true,
        },
      })
      return data
    }

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
