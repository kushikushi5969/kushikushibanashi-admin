import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import authOptions from '@app/api/auth/[...nextauth]/options'
import { BadRequest, NotFoundResponse, ServerError, UnAuthorized } from '../../../../types/api/errorResponse'
import { Category, CategoryUtil } from '../../../../util/app/category'
import { CreateCategoryRequest, FindManyCategoryParams } from '../../../../types/api/category'

/**
 * GET パラメータによって全件取得かdataProviderの取得かを判定する
 * @param req
 * @returns Response
 */
export async function GET(req: NextRequest) {
  const categoryUtil = new CategoryUtil()
  const filter = req.nextUrl.searchParams.get('name_like')
  const _start = req.nextUrl.searchParams.get('_start')
  const _end = req.nextUrl.searchParams.get('_end')
  const sort = req.nextUrl.searchParams.get('_sort')
  const order = req.nextUrl.searchParams.get('_order')
  let searchOptions = {}
  let paginationOptions = {}
  let sortOptions = {}

  if (filter) {
    searchOptions = {
      where: {
        OR: [{ name: { contains: filter } }],
      },
    }
  }
  if (_start && _end) {
    const start = Number(_start)
    const end = Number(_end)
    paginationOptions = {
      skip: start,
      take: end - start,
    }
  }
  if (sort && order) {
    sortOptions = {
      orderBy: { [sort]: order.toLowerCase() as 'asc' | 'desc' },
    }
  }

  const findManyCategoryParams: FindManyCategoryParams = {
    ...searchOptions,
    ...paginationOptions,
    ...sortOptions,
  }

  try {
    const CategoryData = await categoryUtil.findMany(findManyCategoryParams)
    if (Array.isArray(CategoryData)) {
      if (!CategoryData.length) {
        return NextResponse.json(NotFoundResponse, { status: 404 })
      }
    } else {
      if (!CategoryData.data.length) {
        return NextResponse.json(NotFoundResponse, { status: 404 })
      }
    }
    return NextResponse.json(CategoryData)
  } catch (e) {
    return NextResponse.json(ServerError, { status: 500 })
  }
}

/**
 * カテゴリー新規作成リクエストのバリデーション
 * @param data リクエストボディ
 */
const checkCategoryCreateRequest = (data: any): data is CreateCategoryRequest => {
  return typeof data.categoryName === 'string'
}

/**
 * カテゴリーを新規作成する
 * @param req
 * @returns Response
 */
export async function POST(req: NextRequest) {
  // リクエストのセッション情報を検証
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(UnAuthorized, { status: 401 })
  }
  const body = await req.json()
  // バリデーションが通らなければエラー
  if (!checkCategoryCreateRequest(body)) {
    return NextResponse.json(BadRequest, { status: 400 })
  }
  const category = new Category({
    name: body.categoryName,
  })
  try {
    const createdCategory = await category.register()
    return NextResponse.json(createdCategory)
  } catch (e) {
    return NextResponse.json(ServerError, { status: 500 })
  }
}
