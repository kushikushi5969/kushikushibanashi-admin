import { FindManyParams } from '../app/prisma'
/**
 * メディアオブジェクト
 */
export interface MediaData {
  /**
   * メディアごとにユニークなID
   */
  id?: number
  /**
   * url
   * maxlength: 255
   */
  url: string
  created_at?: Date
  updated_at?: Date
}

export interface UpdateMediaRequest {}

export interface CreateMediaRequest {}

export interface GetMediaResponse {}

export interface FindManyMediaParams extends FindManyParams {
  where?: {
    OR: {
      url: { contains: string }
    }
  }
}

/**
 * メディアの一覧取得応答
 */
export interface GetMediaListResponse {
  id: number
  url: string
}
