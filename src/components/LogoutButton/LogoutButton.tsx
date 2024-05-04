import { Button } from '@mui/material'
import { useLogout } from '@refinedev/core'

export default function LogoutButton() {
  const { mutate: logout } = useLogout()

  return (
    <Button className='ml-4' onClick={() => logout({})} variant='contained' color='error'>
      ログアウト
    </Button>
  )
}
