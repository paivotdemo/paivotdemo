import { USSchool } from '../data/us-schools-database'

// NCES API configuration
const NCES_API_BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools'
const NCES_API_KEY = process.env.NCES_API_KEY

interface NCESSchoolResponse {
  results: Array<{
    id: string;
    school: {
      name: string;
      city: string;
      state: string;
      zip: string;
    };
    latest: {
      school: {
        ownership: number; // 1 = public, 2 = private non-profit, 3 = private for-profit
      };
    };
  }>;
}

export async function searchNCESSchools(query: string, type: 'highschool' | 'university'): Promise<USSchool[]> {
  if (!NCES_API_KEY) {
    throw new Error('NCES API key not configured')
  }

  try {
    // For universities, we use the College Scorecard API
    if (type === 'university') {
      const params = new URLSearchParams({
        'api_key': NCES_API_KEY,
        'school.name': query,
        'school.ownership': '1', // public institutions only
        'per_page': '20',
        'fields': 'id,school.name,school.city,school.state,school.zip,latest.school.ownership'
      })

      const response = await fetch(`${NCES_API_BASE_URL}?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch from NCES API')
      }

      const data: NCESSchoolResponse = await response.json()
      
      return data.results.map(school => ({
        id: school.id,
        name: school.school.name,
        type: 'university',
        city: school.school.city,
        state: school.school.state,
        zip: school.school.zip,
        isPublic: school.latest.school.ownership === 1,
        website: undefined // We could add this if needed
      }))
    }
    
    // For high schools, we'll need to use a different endpoint
    // Note: NCES has a separate API for K-12 schools
    // We'll need to implement this part once you have the correct API endpoint and key
    if (type === 'highschool') {
      // TODO: Implement high school search using appropriate NCES API
      throw new Error('High school search not yet implemented')
    }

    return []
  } catch (error) {
    console.error('Error fetching from NCES:', error)
    throw error
  }
} 