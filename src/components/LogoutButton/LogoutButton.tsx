import { signOut } from 'next-auth/react'
import { Button } from '@mui/material'

export default function LogoutButton() {
  return (
    <div className='ml-4'>
      <Button
        className='ml-4 text-blue-500'
        onClick={() => signOut({ callbackUrl: '/login' })}
        variant='outlined'
        color='error'
      >
        ログアウト
      </Button>
    </div>
  )
}
