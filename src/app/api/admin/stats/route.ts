import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Create a Supabase client for server-side operations
    const cookieStore = cookies()
    
    // Create a Supabase client with cookies
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
        }
      }
    )

    // For a real implementation, you would verify the user is authenticated and is an admin
    // For now, we'll return mock data for these metrics
    
    return NextResponse.json({
      totalUsers: 42,
      newUsersToday: 5,
      activeUsers: 30,
      pendingVerifications: 4
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 