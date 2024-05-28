import { FindManyParams } from '../app/prisma'
/**
 * 感想ブログオブジェクト
 */
export interface PostData {
  /**
   * 感想ブログごとにユニークなID
   */
  id?: number
  /**
   * 記事タイトル
   * maxlength: 200
   */
  title: string
  /**
   * 記事コンテンツ
   */
  content: string
  /**
   * カテゴリーID
   */
  category_id: number
  /**
   * サムネイルID
   */
  thumbnail_id?: number | null
  /**
   * 作成ユーザーID
   */
  author_id: number
  created_at?: Date
  updated_at?: Date
}

export interface UpdatePostRequest {
  /**
   * 記事タイトル
   * maxlength: 200
   */
  title: string
  /**
   * 記事コンテンツ
   */
  content: string
  /**
   * カテゴリーID
   */
  categoryId: number
  /**
   * サムネイルID
   */
  thumbnailId: number
}

export interface CreatePostRequest {
  /**
   * 記事タイトル
   * maxlength: 200
   */
  title: string
  /**
   * 記事コンテンツ
   */
  content: string
  /**
   * カテゴリーID
   */
  categoryId: number
  /**
   * サムネイルID
   */
  thumbnailId?: number
}

export interface FindManyPostParams extends FindManyParams {
  where?: {
    OR?: {
      title: { contains: string }
      content: { contains: string }
    }
    category_id: number
  }
}

/**
 * 感想ブログの一覧取得応答
 */
export interface GetPostListResponse {
  id: number
  title: string
  content: string
  category_id: {
    id: number
    name: string
  }
  thumbnail_id?: number | null
  created_at: Date
  updated_at: Date
}
