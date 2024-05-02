'use client'
import { Suspense } from 'react'
import { WelcomePage } from '@refinedev/core'
import LogoutButton from '@components/LogoutButton/LogoutButton'

export default function IndexPage() {
  return (
    <Suspense>
      <LogoutButton />
      {/* <WelcomePage /> */}
    </Suspense>
  )
}
