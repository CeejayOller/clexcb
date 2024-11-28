// src/lib/auth
import { hash, compare } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import type { User, Session, UserRole } from '@/types/auth'
import { USER_ROLES, ROLE_PERMISSIONS } from '@/types/auth'

const SESSION_TTL = 8 * 60 * 60 // 8 hours in seconds
const COOKIE_NAME = 'session'

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function createSessionToken(user: User): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL

  return await new SignJWT({ 
    userId: user.id,
    role: user.role,
    email: user.email
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresAt)
    .setIssuedAt()
    .sign(secret)
}

export function getSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: SESSION_TTL,
    path: '/'
  }
}

export async function verifySessionToken(token: string): Promise<{
  userId: string;
  role: UserRole;
  email: string;
  exp: number;
} | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
    return {
      userId: payload.userId as string,
      role: payload.role as UserRole,
      email: payload.email as string,
      exp: payload.exp as number
    }
  } catch {
    return null
  }
}

export async function getUserFromSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = await cookieStore.get(COOKIE_NAME);
    
    if (!sessionCookie?.value) return null;

    const tokenData = await verifySessionToken(sessionCookie.value);
    if (!tokenData) return null;

    const user = await prisma.user.findUnique({
      where: { 
        id: tokenData.userId,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        lastLogin: true,
        profile: true
      }
    });

    if (!user) return null;

    const transformedUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      isActive: user.isActive,
      lastLogin: user.lastLogin || undefined,
      profile: user.profile as any
    };

    return {
      user: transformedUser,
      expiresAt: tokenData.exp,
      permissions: ROLE_PERMISSIONS[user.role as UserRole]
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export function getDashboardPath(role: UserRole): string {
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

export async function validatePermission(
  userId: string,
  permission: keyof typeof ROLE_PERMISSIONS[UserRole]
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  })

  if (!user) return false

  const role = user.role as UserRole
  return ROLE_PERMISSIONS[role][permission] || false
}