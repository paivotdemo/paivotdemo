import { NextResponse } from 'next/server'
import { searchSchools } from '../../../../services/schools'
import { searchSchools as searchLocalSchools } from '../../../../data/us-schools-database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
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

    // Only use ArcGIS API for university searches
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
      } catch (arcgisError) {
        console.error('ArcGIS search failed:', arcgisError);
        // Fall back to local database
      }
    }

    // Use local database for high schools or if ArcGIS fails
    const institutions = searchLocalSchools({
      query,
      type: type === 'highschool' ? 'highschool' : type === 'college' ? 'university' : undefined,
      state,
      city: undefined
    })

    return NextResponse.json({
      institutions,
      pagination: {
        total: institutions.length,
        page: 1,
        totalPages: 1
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