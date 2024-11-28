// app/(auth)/sign-up/page.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { AuthCard } from '@/components/auth/AuthCard'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { signUp } from '@/app/actions/auth'
import { useState } from 'react'
import { signUpSchema } from '@/lib/validations/auth'
import { USER_ROLES } from '@/types/auth'

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (formData: FormData) => {
    setIsLoading(true)

    try {
      const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
        role: formData.get('role') as string
      }

      const validation = signUpSchema.safeParse(data)
      if (!validation.success) {
        toast({
          title: 'Validation Error',
          description: validation.error.errors[0].message,
          variant: 'destructive'
        })
        return
      }

      const result = await signUp(validation.data)

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
        description: 'Account created successfully'
      })

      router.push(data.role === USER_ROLES.BROKER ? '/admin/overview' : '/client/overview')
    } catch (error) {
      console.error('Sign up error:', error)
      toast({
        title: 'Error',
        description: 'Failed to create account. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard 
      title="Create your account"
      description="Choose your preferred sign up method"
      isLoading={isLoading}
    >
      <SignUpForm action={handleSignUp} isLoading={isLoading} />
    </AuthCard>
  )
}