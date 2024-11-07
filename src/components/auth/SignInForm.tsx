// components/auth/SignInForm.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { AuthFormField } from './AuthCard'

interface SignInFormData {
  email: string
  password: string
}

interface SignInFormProps {
    action: (formData: FormData) => Promise<void>
    isLoading: boolean
  }

  export function SignInForm({ action, isLoading }: SignInFormProps) {
    const [formData, setFormData] = useState<SignInFormData>({
      email: '',
      password: ''
    })
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      await action(formData)
    }

  const updateField = (field: keyof SignInFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AuthFormField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={(value) => updateField('email', value)}
        placeholder="Enter your email"
        required
      />

      <AuthFormField
        name="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={(value) => updateField('password', value)}
        placeholder="Enter your password"
        required
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="mt-4 text-center">
        <Link href="/sign-up" className="text-sm text-blue-600 hover:text-blue-500">
          Don't have an account? Sign up
        </Link>
      </div>
    </form>
  )
}