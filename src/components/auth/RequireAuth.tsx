// src/components/auth/RequireAuth
'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { USER_ROLES, type UserRole, ROLE_PERMISSIONS, type PermissionKey } from '@/types/auth'
import { canAccessRoute } from '@/lib/utils/permissions'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface RequireAuthProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requiresPermission?: PermissionKey
}

export function RequireAuth({ 
  children, 
  allowedRoles,
  requiresPermission 
}: RequireAuthProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for loading to complete
      if (isLoading) return

      console.log('Auth check:', { user, pathname, allowedRoles }) // Debug log

      // No user -> redirect to sign in
      if (!user) {
        const returnUrl = encodeURIComponent(pathname)
        console.log('No user, redirecting to sign in')
        await router.replace(`/sign-in?callbackUrl=${returnUrl}`)
        return
      }

      // Role-based access check
      if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
        console.log('Invalid role access:', { userRole: user.role, allowedRoles })
        
        const defaultRoute = user.role === USER_ROLES.CLIENT
          ? '/client/overview'
          : '/admin/overview'

        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
          variant: 'destructive'
        })

        await router.replace(defaultRoute)
        return
      }

      // Permission-based check
      if (requiresPermission && !canAccessRoute(user, pathname)) {
        console.log('Permission denied:', { 
          user: user.role, 
          requiredPermission: requiresPermission 
        })
        
        toast({
          title: 'Permission Denied',
          description: 'You do not have the required permissions.',
          variant: 'destructive'
        })

        await router.replace('/')
        return
      }
    }

    checkAuth()
  }, [user, isLoading, router, allowedRoles, requiresPermission, pathname])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Auth check failed
  if (!user || (allowedRoles?.length && !allowedRoles.includes(user.role))) {
    return null
  }

  // User is authorized, render children
  return <>{children}</>
}