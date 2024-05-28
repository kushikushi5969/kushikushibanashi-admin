import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import authOptions from '@app/api/auth/[...nextauth]/options'
import { BadRequest, NotFoundResponse, ServerError, UnAuthorized } from '../../../../types/api/errorResponse'
import { Post, PostUtil } from '../../../../util/app/posts'
import { CreatePostRequest, FindManyPostParams } from '../../../../types/api/posts'

/**
 * GET パラメータによって全件取得かdataProviderの取得かを判定する
 * @param req
 * @returns Response
 */
export async function GET(req: NextRequest) {
  const postUtil = new PostUtil()
  const filter = req.nextUrl.searchParams.get('title_like')
  const category_id = req.nextUrl.searchParams.get('category')
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
        OR: [{ title: { contains: filter } }, { content: { contains: filter } }],
      },
    }
  } else if (category_id) {
    searchOptions = {
      where: {
        category_id: Number(category_id),
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

  const findManyPostParams: FindManyPostParams = {
    ...searchOptions,
    ...paginationOptions,
    ...sortOptions,
  }

  try {
    const PostData = await postUtil.findMany(findManyPostParams)
    if (Array.isArray(PostData)) {
      if (!PostData.length) {
        return NextResponse.json(NotFoundResponse, { status: 404 })
      }
    } else {
      if (!PostData.data.length) {
        return NextResponse.json(NotFoundResponse, { status: 404 })
      }
    }
    return NextResponse.json(PostData)
  } catch (e) {
    return NextResponse.json(ServerError, { status: 500 })
  }
}

/**
 * 新規感想ブログ作成リクエストのバリデーション
 * @param data リクエストボディ
 */
const checkPostCreateRequest = (data: any): data is CreatePostRequest => {
  return typeof data.title === 'string' && typeof data.content === 'string' && typeof data.thumbnailId === 'number'
}

/**
 * 感想ブログを新規作成する
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
  // thumbnailIdに値がなけらばid:1（noimage.png）をセット
  if (!body.thumbnailId) {
    body.thumbnailId = 1
  }
  // バリデーションが通らなければエラー
  if (!checkPostCreateRequest(body)) {
    return NextResponse.json(BadRequest, { status: 400 })
  }

  const post = new Post({
    title: body.title,
    content: body.content,
    category_id: body.categoryId,
    thumbnail_id: body.thumbnailId,
    author_id: 1,
  })
  try {
    const createdPost = await post.register()
    return NextResponse.json(createdPost)
  } catch (e) {
    return NextResponse.json(ServerError, { status: 500 })
  }
}
