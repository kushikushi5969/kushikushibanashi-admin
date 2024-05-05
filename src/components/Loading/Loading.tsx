import * as React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

type mode = {
  defaultMode?: string
}

export default function CircularIndeterminate({ defaultMode }: mode) {
  const bgColor = defaultMode === 'dark' ? '#272727' : '#f5f5f5'

  return (
    <div className='grid place-items-center h-dvh w-dvw' style={{ backgroundColor: bgColor }}>
      <Box>
        <CircularProgress />
      </Box>
    </div>
  )
}
