import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Check if the path is protected (admin routes)
  const isAdminPath = path.startsWith('/api/admin') || path.startsWith('/dashboard') || path.startsWith('/admin')
  
  // Check for both production and development session cookies
  const isProduction = process.env.NODE_ENV === 'production'
  
  // Get all possible session cookie names
  const possibleCookieNames = [
    '__Secure-next-auth.session-token',
    'next-auth.session-token',
    '__Host-next-auth.session-token'
  ]
  
  // Try to find a valid session token
  let token = null
  for (const cookieName of possibleCookieNames) {
    const cookieValue = request.cookies.get(cookieName)?.value
    if (cookieValue) {
      token = cookieValue
      break
    }
  }
  
  // Log cookie information in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Path:', path)
    console.log('Is admin path:', isAdminPath)
    console.log('Has token:', !!token)
    
    // Get available cookies without using .keys()
    const availableCookies: string[] = []
    request.cookies.getAll().forEach(cookie => {
      availableCookies.push(cookie.name)
    })
    console.log('Available cookies:', availableCookies)
  }
  
  // If the path is protected and there's no token, redirect to login
  if (isAdminPath && !token) {
    console.log('Redirecting to login: No valid session token found')
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/admin/:path*",
  ]
} 