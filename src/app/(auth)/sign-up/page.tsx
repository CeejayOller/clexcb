// app/(auth)/sign-up/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { AuthCard } from '@/components/auth/AuthCard'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { signUp } from '@/app/actions/auth'
import { useState } from 'react'

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (formData: FormData) => {
    setIsLoading(true)

    try {
      const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        name: formData.get('name') as string,
        role: formData.get('role') as string,
        companyName: formData.get('companyName') as string || undefined,
        companyAddress: formData.get('companyAddress') as string || undefined,
        contactNumber: formData.get('contactNumber') as string || undefined
      }

      // Validate required fields
      if (!data.name || !data.email || !data.password) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        })
        return
      }

      const result = await signUp(data)

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

      router.push(data.role === 'BROKER' ? '/admin/overview' : '/client/overview')
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
    <AuthCard title="Create your account">
      <SignUpForm action={handleSignUp} isLoading={isLoading} />
    </AuthCard>
  )
}