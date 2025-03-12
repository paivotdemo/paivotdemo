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
    const authCookies = cookieNames.filter(name => name.includes('next-auth'))
    
    // Get environment info
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
      // Don't include the actual secret, just whether it exists
      HAS_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
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
      environment: envInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Auth debug error:', error)
    return NextResponse.json({
      error: 'Failed to get debug info',
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
} 