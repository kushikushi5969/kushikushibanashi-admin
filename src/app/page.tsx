'use client'
import { Suspense } from 'react'
import { WelcomePage } from '@refinedev/core'
import { Header } from '@components/Header/Header'

export default function IndexPage() {
  return (
    <Suspense>
      <Header />
      {/* <WelcomePage /> */}
    </Suspense>
  )
}
