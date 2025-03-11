import { NextResponse } from 'next/server'
import { getUsers } from '@/lib/users'

export async function GET() {
  try {
    const users = getUsers()
    return new NextResponse(JSON.stringify({ users }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return new NextResponse(JSON.stringify({ users: [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
} 