// components/auth/SignInForm.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface SignInFormProps {
  action: (formData: FormData) => Promise<void>
  isLoading: boolean
}

export function SignInForm({ action, isLoading }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      action(formData)
    }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          disabled={isLoading}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !email || !password}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      <div className="text-center text-sm">
        <Link 
          href="/sign-up" 
          className="text-primary hover:underline"
          tabIndex={isLoading ? -1 : 0}
        >
          Don't have an account? Sign up
        </Link>
      </div>
    </form>
  )
}