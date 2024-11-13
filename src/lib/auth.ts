import { hash, compare } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import type { User, Session } from '@/types/auth'
import { USER_ROLES, type UserRole } from '@/types/auth'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function hashPassword(password: string) {
  return hash(password, 12)
}

export async function comparePasswords(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}

export async function createSession(userId: string, role: UserRole) {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(new TextEncoder().encode(JWT_SECRET))

  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8 // 8 hours
  })

  return token
}

export async function validateSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')
  
  console.log('Current session cookie:', session) // Debug log
  
  if (!session?.value) {
    console.log('No session cookie found') // Debug log
    return null
  }

  try {
    const { payload } = await jwtVerify(
      session.value,
      new TextEncoder().encode(JWT_SECRET)
    )

    console.log('JWT payload:', payload) // Debug log

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string }
    })

    console.log('Found user:', user) // Debug log

    if (!user) return null

    if (!Object.values(USER_ROLES).includes(user.role as UserRole)) {
      console.log('Invalid role:', user.role) // Debug log
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        companyName: user.companyName || undefined,
        companyAddress: user.companyAddress || undefined,
        contactNumber: user.contactNumber || undefined
      }
    }
  } catch (error) {
    console.error('Session validation error:', error)
    return null
  }
}

export function getDashboardPath(role: UserRole) {
  switch (role) {
    case USER_ROLES.SUPERADMIN:
    case USER_ROLES.BROKER:
      return '/admin/overview'
    case USER_ROLES.CLIENT:
      return '/client/overview'
    default:
      return '/'
  }
}