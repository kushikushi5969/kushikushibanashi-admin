import { withAuth, NextMiddlewareWithAuth, NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    return NextResponse.next()
  } as NextMiddlewareWithAuth,
  {
    // 認証されていない場合のリダイレクト先
    pages: {
      signIn: '/login',
      error: '/login',
    },
  }
)
export const config = {
  matcher: {
    // API routeは認証から除外し各エンドポイントで対応する
    source: '/((?!api/).*)',
  },
}
