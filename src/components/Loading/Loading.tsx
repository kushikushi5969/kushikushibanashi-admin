import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

type AppProps = {
  defaultMode?: string
}

export default function CircularIndeterminate({ defaultMode }: AppProps) {
  const bgColor = defaultMode === 'dark' ? 'background_black' : 'background_white'

  return (
    <div className={`grid place-items-center h-dvh w-dvw bg-${bgColor}`}>
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    </div>
  )
}
