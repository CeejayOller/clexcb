import { UserRole } from '@/types/auth'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      companyName?: string
      companyAddress?: string
      contactNumber?: string
    }
  }

  interface User {
    id: string
    role: UserRole
    companyName?: string
    companyAddress?: string
    contactNumber?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    companyName?: string
    companyAddress?: string
    contactNumber?: string
  }
}