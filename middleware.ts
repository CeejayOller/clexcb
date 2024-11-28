// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySessionToken } from '@/lib/auth'
import { USER_ROLES } from '@/types/auth'
import type { UserRole } from '@/types/auth'

// Define public routes that don't require authentication
const PUBLIC_ROUTES = new Set([
  '/',
  '/sign-in',
  '/sign-up',
  '/password-reset',
  '/verify-email'
])

// Define role-based route restrictions
const ROLE_ROUTE_MAPPING: Record<UserRole, {
  allowed: string[]
  restricted: string[]
  defaultRoute: string
}> = {
  [USER_ROLES.CLIENT]: {
    allowed: ['/client'],
    restricted: ['/admin'],
    defaultRoute: '/client/overview'
  },
  [USER_ROLES.BROKER]: {
    allowed: ['/admin'],
    restricted: ['/client'],
    defaultRoute: '/admin/overview'
  },
  [USER_ROLES.SUPERADMIN]: {
    allowed: ['/admin', '/client'],
    restricted: [],
    defaultRoute: '/admin/overview'
  }
}

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    // Skip middleware for static files and API routes
    if (pathname.startsWith('/_next') || 
        pathname.startsWith('/api/public') ||
        pathname.includes('.')) {
      return NextResponse.next()
    }

    // Get session token
    const sessionToken = request.cookies.get('session')

    // Handle public routes
    if (PUBLIC_ROUTES.has(pathname)) {
      // If user is logged in and tries to access auth pages, redirect to their dashboard
      if (sessionToken?.value) {
        const tokenData = await verifySessionToken(sessionToken.value)
        if (tokenData?.role) {
          const defaultRoute = ROLE_ROUTE_MAPPING[tokenData.role].defaultRoute
          return NextResponse.redirect(new URL(defaultRoute, request.url))
        }
      }
      return NextResponse.next()
    }

    // No token, redirect to sign in
    if (!sessionToken?.value) {
      return redirectToSignIn(request)
    }

    // Verify token and get user details
    const tokenData = await verifySessionToken(sessionToken.value)
    if (!tokenData) {
      return redirectToSignIn(request)
    }

    // Get role configuration
    const userRole = tokenData.role
    const roleRoutes = ROLE_ROUTE_MAPPING[userRole]
    if (!roleRoutes) {
      console.error('Invalid user role:', userRole)
      return redirectToSignIn(request)
    }

    // Check route access
    const isRestrictedRoute = roleRoutes.restricted.some(route => 
      pathname.startsWith(route)
    )
    const isAllowedRoute = roleRoutes.allowed.some(route => 
      pathname.startsWith(route)
    )

    // Handle unauthorized access
    if (isRestrictedRoute || (!isAllowedRoute && !PUBLIC_ROUTES.has(pathname))) {
      return NextResponse.redirect(new URL(roleRoutes.defaultRoute, request.url))
    }

    // User is authorized, add role to headers
    const response = NextResponse.next()
    response.headers.set('x-user-role', userRole)

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('authentication') || error.message.includes('jwt')) {
        return redirectToSignIn(request)
      }
      if (error.message.includes('authorization')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    return NextResponse.redirect(new URL('/error', request.url))
  }
}

function redirectToSignIn(request: NextRequest) {
  const signInUrl = new URL('/sign-in', request.url)
  signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
  return NextResponse.redirect(signInUrl)
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}