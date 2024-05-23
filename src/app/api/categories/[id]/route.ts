import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import authOptions from '@app/api/auth/[...nextauth]/options'
import { BadRequest, NotFoundResponse, ServerError, UnAuthorized } from '../../../../../types/api/errorResponse'
import { Category, CategoryUtil } from '../../../../../util/app/category'
import { FindManyCategoryParams } from '../../../../../types/api/category'

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
