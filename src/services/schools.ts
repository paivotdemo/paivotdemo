import { USSchool } from '../data/us-schools-database'

const ARCGIS_API_BASE_URL = 'https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Postsecondary_School_Locations_Current/FeatureServer/0/query'

interface SearchFilters {
  state?: string;
  county?: string;
  localeType?: 'urban' | 'suburban' | 'rural';
  page?: number;
  limit?: number;
}

interface SearchResponse {
  schools: USSchool[];
  total: number;
  page: number;
  totalPages: number;
}

interface ArcGISSchoolResponse {
  features: Array<{
    attributes: {
      OBJECTID: number;
      UNITID: string;
      NAME: string;
      STREET: string;
      CITY: string;
      STATE: string;
      ZIP: string;
      LAT: number;
      LON: number;
      LOCALE: string;
      NMCNTY: string;
    };
    geometry: {
      x: number;
      y: number;
    };
  }>;
  exceededTransferLimit: boolean;
}

// Cache configuration
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const schoolsCache = new Map<string, { data: SearchResponse; timestamp: number }>();

export async function searchSchools(query: string, filters: SearchFilters = {}): Promise<SearchResponse> {
  try {
    const cacheKey = JSON.stringify({ query, filters });
    const cached = schoolsCache.get(cacheKey);
    
    // Return cached data if it's still valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // Build the where clause for filtering
    let whereClause = `UPPER(NAME) LIKE '%${query.toUpperCase()}%'`;
    
    if (filters.state) {
      whereClause += ` AND STATE = '${filters.state}'`;
    }
    
    if (filters.county) {
      whereClause += ` AND UPPER(NMCNTY) LIKE '%${filters.county.toUpperCase()}%'`;
    }
    
    if (filters.localeType) {
      const localeCodes = {
        urban: ['11', '12', '13'],
        suburban: ['21', '22', '23'],
        rural: ['31', '32', '33', '41', '42', '43']
      }[filters.localeType];
      
      whereClause += ` AND LOCALE IN ('${localeCodes.join("','")}')`;
    }

    // Build pagination parameters
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    const params = new URLSearchParams({
      where: whereClause,
      outFields: '*',
      outSR: '4326',
      f: 'json',
      resultOffset: offset.toString(),
      resultRecordCount: limit.toString()
    });

    console.log('Fetching schools with params:', params.toString());
    const response = await fetch(`${ARCGIS_API_BASE_URL}?${params}`);
    
    if (!response.ok) {
      console.error('ArcGIS API error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      throw new Error(`Failed to fetch from ArcGIS API: ${response.statusText}`);
    }

    const data: ArcGISSchoolResponse = await response.json();
    console.log('ArcGIS API response:', {
      featuresCount: data.features?.length,
      exceededLimit: data.exceededTransferLimit
    });
    
    if (!data.features) {
      console.error('Invalid API response:', data);
      throw new Error('Invalid API response structure');
    }

    const schools = data.features.map(feature => ({
      id: feature.attributes.UNITID,
      name: feature.attributes.NAME,
      type: 'university' as const,  // Fix the type issue
      city: feature.attributes.CITY,
      state: feature.attributes.STATE,
      zip: feature.attributes.ZIP,
      isPublic: true,
      website: undefined,
      street: feature.attributes.STREET,
      county: feature.attributes.NMCNTY,
      localeType: getLocaleType(feature.attributes.LOCALE),
      coordinates: {
        latitude: feature.geometry.y,
        longitude: feature.geometry.x
      }
    }));

    const result = {
      schools,
      total: data.features.length,
      page,
      totalPages: Math.ceil(data.features.length / limit)
    };

    // Cache the results
    schoolsCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error('Error in searchSchools:', error);
    throw error;
  }
}

function getLocaleType(localeCode: string): 'urban' | 'suburban' | 'rural' {
  if (isUrbanArea(localeCode)) return 'urban';
  if (isSuburbanArea(localeCode)) return 'suburban';
  return 'rural';
}

// Helper function to determine if a school is in an urban area
export function isUrbanArea(localeCode: string): boolean {
  // Locale codes 11, 12, 13 are city (urban) areas
  return ['11', '12', '13'].includes(localeCode);
}

// Helper function to determine if a school is in a suburban area
export function isSuburbanArea(localeCode: string): boolean {
  // Locale codes 21, 22, 23 are suburban areas
  return ['21', '22', '23'].includes(localeCode);
}

// Helper function to determine if a school is in a rural area
export function isRuralArea(localeCode: string): boolean {
  // Locale codes 31, 32, 33, 41, 42, 43 are rural areas
  return ['31', '32', '33', '41', '42', '43'].includes(localeCode);
} 