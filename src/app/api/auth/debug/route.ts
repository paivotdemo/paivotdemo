import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerAuthSession } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    // Get the current session
    const session = await getServerAuthSession()
    
    // Get all cookies
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    const cookieNames = allCookies.map(cookie => cookie.name)
    
    // Check for auth-related cookies
    const authCookies = allCookies.filter(cookie => 
      cookie.name.includes('next-auth') || 
      cookie.name.includes('__Secure') || 
      cookie.name.includes('__Host')
    ).map(cookie => ({
      name: cookie.name,
      // Only include properties that exist on RequestCookie
      hasValue: !!cookie.value
    }))
    
    // Get request information
    const requestInfo = {
      url: req.url,
      headers: {
        host: req.headers.get('host'),
        origin: req.headers.get('origin'),
        referer: req.headers.get('referer'),
        userAgent: req.headers.get('user-agent'),
        cookie: req.headers.get('cookie')?.substring(0, 50) + '...' // Truncate for security
      }
    }
    
    // Get environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
      // Don't include the actual secret, just whether it exists
      HAS_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      DATABASE_URL: process.env.DATABASE_URL ? 
        `${process.env.DATABASE_URL.split('://')[0]}://*****` : undefined,
      BASE_URL: process.env.NEXTAUTH_URL || 
        (process.env.NODE_ENV === 'production' ? 'https://paivot.net' : 'http://localhost:3000')
    }
    
    // Return debug info
    return NextResponse.json({
      authenticated: !!session,
      session: session ? {
        user: {
          name: session.user?.name,
          email: session.user?.email,
          role: session.user?.role,
        },
        expires: session.expires,
      } : null,
      cookies: {
        count: allCookies.length,
        names: cookieNames,
        authRelated: authCookies,
      },
      request: requestInfo,
      environment: envInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Auth debug error:', error)
    return NextResponse.json({
      error: 'Failed to get debug info',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
} 