import authOptions from '@app/api/auth/[...nextauth]/options'
import { ThemedLayout } from '@components/ThemedLayout/ThemedLayout'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import React from 'react'

export async function generateMetadata() {
  return {
    title: '投稿一覧',
    description: '投稿一覧',
  }
}

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData()

  if (!data.session?.user) {
    return redirect('/login')
  }

  return <ThemedLayout>{children}</ThemedLayout>
}

async function getData() {
  const session = await getServerSession(authOptions)

  return {
    session,
  }
}
