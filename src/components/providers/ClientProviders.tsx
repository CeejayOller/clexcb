// src/components/providers/ClientProviders.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

export interface ClientProvidersProps {
  children: React.ReactNode
  session: Session | null
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}