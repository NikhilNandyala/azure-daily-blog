'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProviders } from './theme-providers'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProviders>{children}</ThemeProviders>
    </SessionProvider>
  )
}
