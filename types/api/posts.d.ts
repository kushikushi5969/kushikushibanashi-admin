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
   * サムネイルID
   */
  thumbnail_id?: number
  /**
   * 作成ユーザーID
   */
  author_id?: number
  created_at?: Date
  updated_at?: Date
}

export interface UpdatePostRequest {}

export interface CreatePostRequest {}

export interface GetPostResponse {}

/**
 * 感想ブログの一覧取得応答
 */
export interface GetPostListResponse {
  id: number
  title: string
  content: string
  thumbnail_id: number
  author_id: number
  category: {
    id: number
    name: string
  }
  media: {
    id: number
    url: string
  }
}
