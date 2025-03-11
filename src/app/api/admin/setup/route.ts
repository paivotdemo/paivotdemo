'use server'

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-server'

// POST handler to set up the first admin user
export async function POST() {
  try {
    // Get current user
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Count total users
    const userCount = await prisma.user.count()
    
    // If there's only one user, make them an admin
    if (userCount === 1) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: { role: 'admin' }
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'First user promoted to admin' 
      })
    } 
    
    // Check if the current user is already an admin
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id }
    })
    
    if (user?.role === 'admin') {
      return NextResponse.json({ 
        success: true, 
        message: 'User is already an admin' 
      })
    }
    
    return NextResponse.json(
      { error: 'Only the first user can be automatically promoted to admin' },
      { status: 403 }
    )
    
  } catch (error) {
    console.error('Error setting up admin:', error)
    return NextResponse.json(
      { error: 'Failed to set up admin user' },
      { status: 500 }
    )
  }
} 