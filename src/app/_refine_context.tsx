'use client'

import { ColorModeContextProvider } from '@contexts/color-mode'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import CategoryIcon from '@mui/icons-material/Category'
import { dataProvider } from '@providers/data-provider'
import { AuthProvider, I18nProvider, Refine } from '@refinedev/core'
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar'
import { RefineSnackbarProvider, useNotificationProvider } from '@refinedev/mui'
import routerProvider from '@refinedev/nextjs-router'
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { usePathname } from 'next/navigation'
import React from 'react'
import Loading from '@components/Loading/Loading'
// initialize i18n
import '../providers/i18n'

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
  const { t, i18n } = useTranslation()
  const to = usePathname()
  const defaultMode = props?.defaultMode

  if (status === 'loading') {
    return <Loading defaultMode={defaultMode} />
  }

  const i18nProvider: I18nProvider = {
    translate: (key: string, params: Record<string, string>) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
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
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              resources={[
                {
                  name: 'homes',
                  list: '/home',
                  meta: {
                    icon: <HomeOutlinedIcon />,
                  },
                },
                {
                  name: 'posts',
                  list: '/posts',
                  meta: {
                    canDelete: true,
                    icon: <ArticleOutlinedIcon />,
                  },
                },
                {
                  name: 'categories',
                  list: '/categories',
                  create: '/categories/create',
                  edit: '/categories/edit/:id',
                  show: '/categories/show/:id',
                  meta: {
                    canDelete: true,
                    icon: <CategoryIcon />,
                  },
                },
              ]}
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
