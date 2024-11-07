// app/(auth)/sign-in/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { AuthCard } from '@/components/auth/AuthCard'
import { SignInForm } from '@/components/auth/SignInForm'
import { signIn } from '@/app/actions/auth'
import { useState } from 'react'
import { USER_ROLES } from '@/types/auth'

export default function SignInPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (formData: FormData) => {
    setIsLoading(true)

    try {
      const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
      }

      const result = await signIn(data)

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Success',
        description: 'Signed in successfully'
      })

      // Redirect based on role
      switch (result.role) {
        case USER_ROLES.SUPERADMIN:
        case USER_ROLES.BROKER:
          router.push('/admin/overview')
          break
        case USER_ROLES.CLIENT:
          router.push('/client/overview')
          break
        default:
          router.push('/')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard title="Sign in to your account">
      <SignInForm action={handleSignIn} isLoading={isLoading} />
    </AuthCard>
  )
}