import { FindManyParams } from '../app/prisma'
/**
 * カテゴリーオブジェクト
 */
export interface CategoryData {
  /**
   * カテゴリーごとにユニークなID
   */
  id?: number
  /**
   * カテゴリー
   * maxlength: 50
   */
  name: string
  created_at?: Date
  updated_at?: Date
}

export interface UpdateCategoryRequest {
  /**
   * カテゴリー
   * maxlength: 50
   */
  categoryName: string
}

export interface CreateCategoryRequest {}

export interface GetCategoryResponse {}

export interface FindManyCategoryParams extends FindManyParams {
  where?: {
    OR: {
      name: { contains: string }
    }
  }
}

/**
 * カテゴリーの一覧取得応答
 */
export interface GetCategoryListResponse {
  id: number
  name: string
}
