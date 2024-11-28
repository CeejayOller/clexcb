// src/lib/validations/auth.ts
import { z } from 'zod'
import { USER_ROLES } from '@/types/auth'

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name is required'),
  role: z.enum([USER_ROLES.CLIENT, USER_ROLES.BROKER]),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  contactNumber: z.string().optional()
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>