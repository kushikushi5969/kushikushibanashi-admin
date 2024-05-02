import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      checks: 'nonce', // Google認証時にランダムな文字列（numberUsedOnce）を使用する
    }),
  ],
  session: {
    maxAge: 24 * 60 * 60, //24時間セッションがなければSignOut
    updateAge: 12 * 60 * 60, //12時間に一度セッション情報を確認
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && account.provider === 'google' && user.email === process.env.OWNER_EMAIL) {
        return true
      }
      return false
    },
  },
}

export default authOptions
