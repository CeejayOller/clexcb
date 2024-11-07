'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { User, Session } from '@/types/auth'
import { validateSessionAction, signOutAction } from '@/app/actions/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const session = await validateSessionAction()
        
        if (session?.user) {
          // Ensure all required User properties are present
          const userData: User = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            companyName: session.user.companyName || undefined,
            companyAddress: session.user.companyAddress || undefined,
            contactNumber: session.user.contactNumber || undefined
          }
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const signOut = async () => {
    try {
      await signOutAction()
      setUser(null)
      router.push('/sign-in')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
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