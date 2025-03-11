import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Check if the path is protected (admin routes)
  const isAdminPath = path.startsWith('/api/admin') || path.startsWith('/dashboard')
  
  // Get the token from the session cookie
  const token = request.cookies.get('next-auth.session-token')?.value
  
  // If the path is protected and there's no token, redirect to login
  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/admin/:path*",
  ]
} 