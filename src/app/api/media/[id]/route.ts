import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'
import authOptions from '@app/api/auth/[...nextauth]/options'
import { BadRequest, NotFoundResponse, ServerError, UnAuthorized } from '../../../../../types/api/errorResponse'
import { MediaUtil } from '../../../../../util/app/media'

/**
 * 個別のメディア詳細を取得する
 * @param req
 * @returns Response
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  if (!id) {
    return NextResponse.json(BadRequest, { status: 400 })
  }
  try {
    const mediaShowData = await MediaUtil.findById(Number(id))
    if (!mediaShowData) {
      return NextResponse.json(NotFoundResponse, { status: 404 })
    }
    return NextResponse.json(mediaShowData)
  } catch (e) {
    return NextResponse.json(ServerError, { status: 500 })
  }
}
