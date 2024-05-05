'use client'

import { Header } from '@components/Header/Header'
import { ThemedLayoutV2, ThemedTitleV2 } from '@refinedev/mui'
import WebAssetOutlinedIcon from '@mui/icons-material/WebAssetOutlined'
import WebAssetSharpIcon from '@mui/icons-material/WebAssetSharp'
import React from 'react'

export const ThemedLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemedLayoutV2
      Title={({ collapsed }) => (
        <ThemedTitleV2
          collapsed={collapsed}
          icon={collapsed ? <WebAssetSharpIcon /> : <WebAssetOutlinedIcon />}
          text='くしくし話 管理画面'
        />
      )}
      Header={() => <Header sticky />}
    >
      {children}
    </ThemedLayoutV2>
  )
}
