/**
 * findMany関数の共通クエリーオプション
 */
export interface FindManyParams {
  skip?: number
  take?: number
  orderBy?: { [sort: string]: 'asc' | 'desc' }
}
