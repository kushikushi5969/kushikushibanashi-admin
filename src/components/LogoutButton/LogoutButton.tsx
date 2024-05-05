import { IconButton } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useLogout } from '@refinedev/core'

export default function LogoutButton() {
  const { mutate: logout } = useLogout()

  return (
    <IconButton className='ml-2' onClick={() => logout({})} color='inherit'>
      <LogoutIcon />
    </IconButton>
  )
}
