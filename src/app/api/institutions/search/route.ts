import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { searchSchools } from '../../../../services/schools'
import { searchHighSchools } from '../../../../services/highschools'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const type = searchParams.get('type')
    
    // Get filter parameters
    const state = searchParams.get('state') || undefined
    const county = searchParams.get('county') || undefined
    const localeType = (searchParams.get('localeType') as 'urban' | 'suburban' | 'rural') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    console.log('Search request:', {
      query,
      type,
      state,
      county,
      localeType,
      page,
      limit
    });

    if (!query) {
      return NextResponse.json({
        institutions: [],
        pagination: {
          total: 0,
          page: 1,
          totalPages: 0
        }
      })
    }

    // Use appropriate service based on institution type
    if (type === 'university') {
      try {
        const result = await searchSchools(query, {
          state,
          county,
          localeType,
          page,
          limit
        })
        
        return NextResponse.json({
          institutions: result.schools,
          pagination: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages
          }
        })
      } catch (error) {
        console.error('University search failed:', error);
        throw error;
      }
    } else if (type === 'highschool') {
      try {
        const result = await searchHighSchools(query, {
          state,
          county,
          localeType,
          page,
          limit
        })

        return NextResponse.json({
          institutions: result.schools,
          pagination: {
            total: result.total,
            page: result.page,
            totalPages: result.totalPages
          }
        })
      } catch (error) {
        console.error('High school search failed:', error);
        throw error;
      }
    }

    // If no valid type specified, return empty results
    return NextResponse.json({
      institutions: [],
      pagination: {
        total: 0,
        page: 1,
        totalPages: 0
      }
    })
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search institutions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 