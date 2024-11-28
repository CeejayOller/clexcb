'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { User, Session } from '@/types/auth'
import { signOut } from '@/app/actions/auth' // Changed from signOutAction
import { useToast } from '@/components/ui/use-toast'
import { USER_ROLES } from '@/types/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
  setUser: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    async function loadUser() {
      try {
        console.log('Loading user session...')
        
        const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up'
        const isPublicRoute = pathname.startsWith('/public')

        if (!user && !isAuthPage && !isPublicRoute) {
          console.log('No user session, redirecting to sign-in')
          router.replace('/sign-in')
          return
        }

        if (user && isAuthPage) {
          console.log('User already authenticated, redirecting to dashboard')
          const route = user.role === USER_ROLES.CLIENT 
            ? '/client/overview' 
            : '/admin/overview'
          router.replace(route)
        }

      } catch (error) {
        console.error('Session validation error:', error)
        toast({
          title: 'Error',
          description: 'Session validation failed',
          variant: 'destructive'
        })
        
        if (!pathname.startsWith('/sign-')) {
          router.replace('/sign-in')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [pathname, user])

  const handleSignOut = async () => {
    try {
      console.log('Signing out...')
      const result = await signOut() // Using the correct function name
      
      if (result.success) {
        console.log('Sign out successful')
        setUser(null)
        router.replace('/sign-in')
      } else {
        throw new Error(result.error || 'Failed to sign out')
      }
    } catch (error) {
      console.error('Sign out error:', error)
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        variant: 'destructive'
      })
    }
  }

  const value = {
    user,
    isLoading,
    signOut: handleSignOut,
    setUser
  }

  console.log('AuthProvider state:', {
    user,
    isLoading,
    pathname,
    isAuthPage: pathname === '/sign-in' || pathname === '/sign-up'
  })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}