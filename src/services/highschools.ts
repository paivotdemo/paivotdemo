import { USSchool } from '../data/us-schools-database';

const ARCGIS_API_BASE_URL = 'https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Public_School_Locations_Current/FeatureServer/0/query';

interface ArcGISSchoolResponse {
  features: Array<{
    attributes: {
      OBJECTID: number;
      NCESSCH: string;
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

export async function searchHighSchools(query: string, filters: {
  state?: string;
  county?: string;
  localeType?: 'urban' | 'suburban' | 'rural';
  page?: number;
  limit?: number;
} = {}): Promise<{
  schools: USSchool[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
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

    const response = await fetch(`${ARCGIS_API_BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch from ArcGIS API');
    }

    const data: ArcGISSchoolResponse = await response.json();
    
    const schools = data.features.map(feature => ({
      id: feature.attributes.NCESSCH,
      name: feature.attributes.NAME,
      type: 'highschool' as const,
      city: feature.attributes.CITY,
      state: feature.attributes.STATE,
      zip: feature.attributes.ZIP,
      isPublic: true,
      street: feature.attributes.STREET,
      county: feature.attributes.NMCNTY,
      localeType: getLocaleType(feature.attributes.LOCALE),
      coordinates: {
        latitude: feature.attributes.LAT,
        longitude: feature.attributes.LON
      }
    }));

    return {
      schools,
      total: schools.length,
      page,
      totalPages: Math.ceil(schools.length / limit)
    };
  } catch (error) {
    console.error('Error searching high schools:', error);
    return {
      schools: [],
      total: 0,
      page: 1,
      totalPages: 0
    };
  }
}

function getLocaleType(localeCode: string): 'urban' | 'suburban' | 'rural' {
  const code = parseInt(localeCode);
  if (code >= 11 && code <= 13) return 'urban';
  if (code >= 21 && code <= 23) return 'suburban';
  return 'rural';
} 