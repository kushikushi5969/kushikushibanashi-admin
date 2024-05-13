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

export interface UpdateCategoryRequest {}

export interface CreateCategoryRequest {}

export interface GetCategoryResponse {}

/**
 * カテゴリーの一覧取得応答
 */
export interface GetCategoryListResponse {
  id: number
  name: string
}
