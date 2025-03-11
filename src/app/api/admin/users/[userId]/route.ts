import { NextResponse } from 'next/server'
import { deleteUser } from '@/lib/users'

type Props = {
  params: {
    userId: string
  }
}

export async function DELETE(_: Request, { params }: Props) {
  const { userId } = params

  try {
    const success = deleteUser(userId)
    if (!success) {
      return new NextResponse('User not found', { status: 404 })
    }
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 