'use server'

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-server'

// POST handler to check if an email is registered as admin
export async function POST(request: Request) {
  try {
    // Check if the current user is authenticated and has admin role
    const currentUser = await getCurrentUser()
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin role required to check other accounts' },
        { status: 403 }
      )
    }
    
    // Get email from request body
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    // Check if the email exists and is an admin
    const user = await prisma.user.findUnique({
      where: { 
        email: email 
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    })
    
    if (!user) {
      return NextResponse.json({ 
        exists: false,
        isAdmin: false,
        message: 'User not found' 
      })
    }
    
    return NextResponse.json({
      exists: true,
      isAdmin: user.role === 'admin',
      userId: user.id,
      email: user.email,
      role: user.role
    })
    
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    )
  }
} 