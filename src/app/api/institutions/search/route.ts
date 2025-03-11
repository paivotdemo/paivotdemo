import { NextResponse } from 'next/server'
import { searchInstitutions } from '@/lib/users'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const type = (searchParams.get('type') as 'highschool' | 'college') || 'highschool'

    const institutions = searchInstitutions(query, type)
    
    return new NextResponse(JSON.stringify({ institutions }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Failed to search institutions:', error)
    return new NextResponse(JSON.stringify({ institutions: [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
} 