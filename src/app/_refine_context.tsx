'use client'

import { AuthProvider, GitHubBanner, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import { RefineSnackbarProvider, useNotificationProvider } from '@refinedev/mui'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import React from 'react'
import Loading from '@components/Loading/Loading'

import routerProvider from '@refinedev/nextjs-router'

import { ColorModeContextProvider } from '@contexts/color-mode'
import { dataProvider } from '@providers/data-provider'

type RefineContextProps = {
  defaultMode?: string
}

export const RefineContext = (props: React.PropsWithChildren<RefineContextProps>) => {
  return (
    <SessionProvider>
      <App {...props} />
    </SessionProvider>
  )
}

type AppProps = {
  defaultMode?: string
}

const App = (props: React.PropsWithChildren<AppProps>) => {
  const { data, status } = useSession()
  const to = usePathname()
  const defaultMode = props?.defaultMode

  if (status === 'loading') {
    return <Loading defaultMode={defaultMode} />
  }

  const authProvider: AuthProvider = {
    login: async () => {
      signIn('google', {
        callbackUrl: to ? to.toString() : '/',
        redirect: true,
      })
      return {
        success: true,
      }
    },
    logout: async () => {
      signOut({
        redirect: true,
        callbackUrl: '/login',
      })
      return {
        success: true,
      }
    },
    onError: async (error) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        }
      }
      return {
        error,
      }
    },
    check: async () => {
      if (status === 'unauthenticated') {
        return {
          authenticated: false,
          redirectTo: '/login',
        }
      }
      return {
        authenticated: true,
      }
    },
    getPermissions: async () => {
      return null
    },
    getIdentity: async () => {
      if (data?.user) {
        const { user } = data
        return {
          name: user.name,
          avatar: user.image,
        }
      }
      return null
    },
  }

  return (
    <>
      <RefineKbarProvider>
        <ColorModeContextProvider defaultMode={defaultMode}>
          <RefineSnackbarProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              resources={[
                {
                  name: 'HOME',
                  list: '/home',
                  meta: {
                    icon: <HomeOutlinedIcon />,
                  },
                  options: {
                    label: 'ホーム',
                  },
                },
                {
                  name: 'posts',
                  list: '/posts',
                  meta: {
                    canDelete: true,
                    icon: <ArticleOutlinedIcon />,
                  },
                  options: {
                    label: '投稿',
                  },
                },
              ]}
              authProvider={authProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
              }}
            >
              {props.children}
              <RefineKbar />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </>
  )
}
