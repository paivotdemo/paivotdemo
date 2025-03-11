import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

// GET handler to fetch all users
export async function GET() {
  try {
    // Check if the current user is authenticated and has admin role
    const currentUser = await getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin role required' },
        { status: 403 }
      )
    }
    
    // Fetch all users, excluding sensitive information
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true, 
        email: true,
        image: true,
        role: true,
        createdAt: true,
        // Exclude password and other sensitive fields
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(users)
    
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve users' },
      { status: 500 }
    )
  }
} 