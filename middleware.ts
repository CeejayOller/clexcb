// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Function to verify JWT token
async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-default-secret'
    );
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// Define role-based route permissions
const ROLE_PERMISSIONS = {
  SUPERADMIN: ['/admin/*'],
  ADMIN: ['/admin/*', '!/admin/superadmin/*'],
  USER: ['/client/*']
} as const;

// Helper to check if path matches pattern
function matchesPattern(path: string, pattern: string): boolean {
  const regexPattern = pattern
    .replace('*', '.*')
    .replace('/', '\\/')
    .replace('!', '^');
  return new RegExp(regexPattern).test(path);
}

// Main middleware function
export async function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;

  // If trying to access auth pages while logged in, redirect to dashboard
  if (token && (path === '/sign-in' || path === '/sign-up')) {
    return NextResponse.redirect(new URL('/admin/overview', request.url));
  }

  // If no token and trying to access protected routes
  if (!token && (path.startsWith('/admin') || path.startsWith('/client'))) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // For protected routes, verify role-based access
  if (token) {
    const payload = await verifyToken(token);
    
    if (!payload) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    const userRole = payload.role as keyof typeof ROLE_PERMISSIONS;
    const permissions = ROLE_PERMISSIONS[userRole] || [];

    // Check if user has permission for this route
    const hasPermission = permissions.some(pattern => {
      if (pattern.startsWith('!')) {
        return !matchesPattern(path, pattern.slice(1));
      }
      return matchesPattern(path, pattern);
    });

    if (!hasPermission) {
      // Redirect to appropriate dashboard based on role
      return NextResponse.redirect(
        new URL(
          userRole === 'USER' ? '/client/overview' : '/admin/overview',
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}

// Configure which routes use the middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/client/:path*',
    '/sign-in',
    '/sign-up'
  ]
};