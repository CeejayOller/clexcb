// src/components/auth/RequireAuth.tsx
'use client'

import { useAuth } from '@/components/layout/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { USER_ROLES, type UserRole } from '@/types/auth'
import { canAccessRoute } from '@/lib/utils/permissions'

interface RequireAuthProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requiresPermission?: string
}

export function RequireAuth({ 
  children, 
  allowedRoles,
  requiresPermission 
}: RequireAuthProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/sign-in')
        return
      }

      // Check role-based access
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on role
        switch (user.role) {
          case USER_ROLES.CLIENT:
            router.push('/client/overview')
            break
          case USER_ROLES.BROKER:
          case USER_ROLES.SUPERADMIN:
            router.push('/admin/overview')
            break
          default:
            router.push('/')
        }
        return
      }

      // Check route access
      if (!canAccessRoute(user, pathname)) {
        router.push('/')
        return
      }
    }
  }, [user, isLoading, router, allowedRoles, pathname])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // If no user or not authorized, render nothing while redirecting
  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null
  }

  // User is authorized, render children
  return <>{children}</>
}