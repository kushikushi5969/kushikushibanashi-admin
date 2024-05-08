import React, { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Cookies from 'js-cookie'

interface LanguageSelectorProps {
  code: string
  label: string
  flagUrl: string
}

export default function LanguageSelector() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const currentLocale = Cookies.get('NEXT_LOCALE') || 'ja'

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const changeLocale = (lang: string) => {
    Cookies.set('NEXT_LOCALE', lang)
    window.location.reload()
    handleClose()
  }

  const languages: LanguageSelectorProps[] = [
    { code: 'ja', label: '日本語', flagUrl: '/images/flags/ja.svg' },
    { code: 'en', label: 'English', flagUrl: '/images/flags/en.svg' },
    { code: 'de', label: 'German', flagUrl: '/images/flags/de.svg' },
  ]

  return (
    <div>
      <Button onClick={handleClick} endIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} sx={{ textTransform: 'none' }}>
        <Avatar sx={{ width: 22, height: 22, marginRight: 1 }} src={`/images/flags/${currentLocale}.svg`} />
        <Typography variant='body2' color='#fff'>
          {languages.find((lang) => lang.code === currentLocale)?.label}
        </Typography>
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => changeLocale(language.code)}
            selected={language.code === currentLocale}
          >
            <Avatar sx={{ width: 22, height: 22, marginRight: 2 }} src={language.flagUrl} />
            {language.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
