import { Metadata } from 'next'
import { cookies } from 'next/headers'
import React, { Suspense } from 'react'
import { RefineContext } from './_refine_context'

export const metadata: Metadata = {
  title: {
    template: '%s | くしくし話 管理画面',
    default: 'くしくし話 管理画面',
  },
  description: 'くしくし話の管理画面です。',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')
  const defaultMode = theme?.value === 'dark' ? 'dark' : 'light'

  return (
    <html lang='ja'>
      <body>
        <Suspense>
          <RefineContext defaultMode={defaultMode}>{children}</RefineContext>
        </Suspense>
      </body>
    </html>
  )
}
