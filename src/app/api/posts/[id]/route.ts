import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import authOptions from '@app/api/auth/[...nextauth]/options'
import { BadRequest, NotFoundResponse, ServerError, UnAuthorized } from '../../../../../types/api/errorResponse'
import { PostUtil } from '../../../../../util/app/posts'
import { UpdatePostRequest } from '../../../../../types/api/posts'

/**
 * 個別の感想ブログ詳細を取得する
 * @param req
 * @returns Response
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  if (!id) {
    return NextResponse.json(BadRequest, { status: 400 })
  }
  try {
    const postShowData = await PostUtil.findById(Number(id))
    if (!postShowData) {
      return NextResponse.json(NotFoundResponse, { status: 404 })
    }
    return NextResponse.json(postShowData)
  } catch (e) {
    return NextResponse.json(ServerError, { status: 500 })
  }
}

/**
 * 個別感想ブログの更新リクエストのバリデーション
 * @param data リクエストボディ
 */
const checkPostUpdateRequest = (data: any): data is UpdatePostRequest => {
  return (
    typeof data.title === 'string' &&
    typeof data.content === 'string' &&
    typeof data.categoryId === 'number' &&
    typeof data.thumbnailId === 'number'
  )
}

/**
 * 感想ブログを更新する
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
    const data = await PostUtil.findById(parseInt(id))
    // データがなければエラー
    if (!data) {
      return NextResponse.json(BadRequest, { status: 400 })
    }
    // thumbnailIdに値がなけらばid:1（noimage.png）をセット
    if (!body.thumbnailId) {
      body.thumbnailId = 1
    }
    // バリデーションが通らなければエラー
    if (!checkPostUpdateRequest(body)) {
      return NextResponse.json(BadRequest, { status: 400 })
    }

    data.update(body.title, body.content, body.categoryId, body.thumbnailId)
    const postUtil = new PostUtil()
    const updatedPost = await postUtil.update(data)
    return NextResponse.json(updatedPost)
  } catch (e) {
    return NextResponse.json(ServerError, { status: 500 })
  }
}

/**
 * 感想ブログを削除する
 * @param req
 * @param params
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // リクエストのセッション情報を検証
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(UnAuthorized, { status: 401 })
  }
  const id = params.id
  if (!id) {
    return NextResponse.json(BadRequest, { status: 400 })
  }
  try {
    const postUtil = new PostUtil()
    await postUtil.delete(Number(id))
    return NextResponse.json({ message: 'Deleted.' }, { status: 200 })
  } catch (e: any) {
    // P2025エラー (データが存在しない場合)は400エラー
    if (e.code === 'P2025') {
      return NextResponse.json(BadRequest, { status: 400 })
    }
    return NextResponse.json(ServerError, { status: 500 })
  }
}
