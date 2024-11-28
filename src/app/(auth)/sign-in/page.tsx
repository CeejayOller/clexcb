// app/(auth)/sign-in/page.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { AuthCard } from '@/components/auth/AuthCard'
import { SignInForm } from '@/components/auth/SignInForm'
import { signIn } from '@/app/actions/auth'
import { useState } from 'react'
import { USER_ROLES } from '@/types/auth'
import { signInSchema, type SignInInput } from '@/lib/validations/auth'
import { useAuth } from '@/components/providers/AuthProvider'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useAuth()

  const handleSignIn = async (formData: FormData) => {
    setIsLoading(true)

    try {
      const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
      }

      // Validate input data
      const validation = signInSchema.safeParse(data)
      if (!validation.success) {
        toast({
          title: 'Validation Error',
          description: validation.error.errors[0].message,
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }

      const result = await signIn(validation.data)
      console.log('Sign in result:', result)

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive'
        })
        return
      }

      if (result.user) {
        // Update the user state
        setUser(result.user)
        
        toast({
          title: 'Success',
          description: 'Signed in successfully'
        })

        // Get return URL if any
        const callbackUrl = searchParams.get('callbackUrl')
        if (callbackUrl && !callbackUrl.startsWith('/sign-')) {
          await router.replace(callbackUrl)
        } else {
          // Default routing based on role
          const route = result.user.role === USER_ROLES.CLIENT 
            ? '/client/overview'
            : '/admin/overview'
          await router.replace(route)
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
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