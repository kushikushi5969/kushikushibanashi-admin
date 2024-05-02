import { signOut } from 'next-auth/react'
import { Button } from '@mui/material'

export default function LogoutButton() {
  return (
    <Button onClick={() => signOut({ callbackUrl: '/login' })} variant='outlined' color='error'>
      ログアウト
    </Button>
  )
}