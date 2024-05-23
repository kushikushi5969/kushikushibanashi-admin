import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import authOptions from '@app/api/auth/[...nextauth]/options'
import { BadRequest, NotFoundResponse, ServerError, UnAuthorized } from '../../../../../types/api/errorResponse'
import { CategoryUtil } from '../../../../../util/app/category'
import { UpdateCategoryRequest } from '../../../../../types/api/category'

/**
 * 個別のカテゴリー詳細を取得する
 * @param req
 * @returns Response
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  if (!id) {
    return NextResponse.json(BadRequest, { status: 400 })
  }
  try {
    const categoryShowData = await CategoryUtil.findById(Number(id))
    if (!categoryShowData) {
      return NextResponse.json(NotFoundResponse, { status: 404 })
    }
    return NextResponse.json(categoryShowData)
  } catch (e) {
    return NextResponse.json(ServerError, { status: 500 })
  }
}

/**
 * 個別カテゴリーの更新リクエストのバリデーション
 * @param data リクエストボディ
 */
const checkCategoryUpdateRequest = (data: any): data is UpdateCategoryRequest => {
  return typeof data.categoryName === 'string'
}

/**
 * カテゴリーを更新する
 * @param req
 * @param params
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // リクエストのセッション情報を検証
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(UnAuthorized, { status: 401 })
  }
  const id = params.id
  if (!id) {
    return NextResponse.json(BadRequest, { status: 400 })
  }
  const body = await req.json()
  try {
    const data = await CategoryUtil.findById(parseInt(id))
    // データがなければエラー
    if (!data) {
      return NextResponse.json(BadRequest, { status: 400 })
    }
    // バリデーションが通らなければエラー
    if (!checkCategoryUpdateRequest(body)) {
      return NextResponse.json(BadRequest, { status: 400 })
    }

    data.update(body.categoryName)
    const categoryUtil = new CategoryUtil()
    const updatedCategory = await categoryUtil.update(data)
    return NextResponse.json(updatedCategory)
  } catch (e) {
    return NextResponse.json(ServerError, { status: 500 })
  }
}
