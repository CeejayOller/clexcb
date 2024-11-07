// components/auth/SignUpForm.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { AuthFormField } from './AuthCard'
import { RoleSelect } from './RoleSelect'

interface SignUpFormData {
  email: string
  password: string
  name: string
  role: string
  companyName: string
  companyAddress: string
  contactNumber: string
}

interface SignUpFormProps {
    action: (formData: FormData) => Promise<void>
    isLoading: boolean
  }
  
  export function SignUpForm({ action, isLoading }: SignUpFormProps) {
    const [formData, setFormData] = useState<SignUpFormData>({
      email: '',
      password: '',
      name: '',
      role: 'CLIENT',
      companyName: '',
      companyAddress: '',
      contactNumber: ''
    })
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const formDataToSend = new FormData()
  
      // Explicitly add each field to FormData
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value || '') // Send empty string instead of null
      })
  
      await action(formDataToSend)
    }

  const updateField = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RoleSelect 
        value={formData.role}
        onChange={(value) => updateField('role', value)}
      />

      <AuthFormField
        name="name"
        label="Full Name"
        value={formData.name}
        onChange={(value) => updateField('name', value)}
        placeholder="Enter your full name"
        required
      />

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
        placeholder="Create a password"
        required
      />

      <AuthFormField
        name="companyName"
        label="Company Name"
        value={formData.companyName}
        onChange={(value) => updateField('companyName', value)}
        placeholder="Enter company name"
      />

      <AuthFormField
        name="companyAddress"
        label="Company Address"
        value={formData.companyAddress}
        onChange={(value) => updateField('companyAddress', value)}
        placeholder="Enter company address"
      />

      <AuthFormField
        name="contactNumber"
        label="Contact Number"
        value={formData.contactNumber}
        onChange={(value) => updateField('contactNumber', value)}
        placeholder="Enter contact number"
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Sign up'}
      </Button>

      <div className="mt-4 text-center">
        <Link href="/sign-in" className="text-sm text-blue-600 hover:text-blue-500">
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  )
}