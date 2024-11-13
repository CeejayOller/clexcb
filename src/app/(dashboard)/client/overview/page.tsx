'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/layout/AuthProvider'
import { USER_ROLES } from '@/types/auth'

export default function ClientOverviewPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/sign-in')
      } else if (user.role !== USER_ROLES.CLIENT) {
        router.push('/admin/clients')
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Welcome, {user.name}</h1>
      {/* Add your client dashboard content here */}
    </div>
  )
}