import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client for the middleware
  const supabase = createMiddlewareClient({ req, res })
  
  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
  
  // Protected routes that require authentication
  const protectedPaths = ['/profile', '/admin']
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(`${path}/`)
  )
  
  // If accessing a protected route without authentication, redirect to login
  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }
  
  return res
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
  ],
} 