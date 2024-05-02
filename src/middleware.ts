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
