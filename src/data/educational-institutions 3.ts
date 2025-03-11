export interface Institution {
  name: string;
  city: string;
  state: string;
  type: 'highschool' | 'college';
  id?: string;
  url?: string;
  enrollment?: number;
  phone?: string;
  address?: string;
  zip?: string;
  district?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
}

interface SearchParams {
  query?: string;
  type?: 'highschool' | 'college';
  state?: string;
  city?: string;
  page?: number;
  limit?: number;
}

interface SearchResponse {
  institutions: Institution[];
  total: number;
  page: number;
  totalPages: number;
  filters: {
    availableStates: string[];
    availableCities: string[];
    availableDistricts: string[];
    availableCounties: string[];
  };
}

// Sample data for high schools
export const highSchools: Institution[] = [
  { name: "Abraham Lincoln High School", city: "San Francisco", state: "CA", type: "highschool" },
  { name: "Berkeley High School", city: "Berkeley", state: "CA", type: "highschool" },
  { name: "Lowell High School", city: "San Francisco", state: "CA", type: "highschool" },
  { name: "Oakland Technical High School", city: "Oakland", state: "CA", type: "highschool" },
  { name: "Palo Alto High School", city: "Palo Alto", state: "CA", type: "highschool" },
];

// Sample data for colleges
export const colleges: Institution[] = [
  { name: "University of California, Berkeley", city: "Berkeley", state: "CA", type: "college" },
  { name: "Stanford University", city: "Stanford", state: "CA", type: "college" },
  { name: "San Francisco State University", city: "San Francisco", state: "CA", type: "college" },
  { name: "University of San Francisco", city: "San Francisco", state: "CA", type: "college" },
  { name: "Santa Clara University", city: "Santa Clara", state: "CA", type: "college" },
];

export async function searchInstitutions(params: SearchParams): Promise<SearchResponse> {
  // Filter institutions based on type
  let results = params.type === 'highschool' ? highSchools : colleges;

  // Filter based on search query
  if (params.query) {
    const query = params.query.toLowerCase();
    results = results.filter(institution => 
      institution.name.toLowerCase().includes(query) ||
      institution.city.toLowerCase().includes(query) ||
      institution.state.toLowerCase().includes(query)
    );
  }

  // Filter by state if provided
  if (params.state) {
    results = results.filter(institution => 
      institution.state.toLowerCase() === params.state?.toLowerCase()
    );
  }

  // Filter by city if provided
  if (params.city) {
    results = results.filter(institution => 
      institution.city.toLowerCase() === params.city?.toLowerCase()
    );
  }

  // Calculate pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);

  // Get available filters
  const availableStates = [...new Set(results.map(i => i.state))].sort();
  const availableCities = [...new Set(results.map(i => i.city))].sort();
  const availableDistricts = [...new Set(results.map(i => i.district).filter((d): d is string => !!d))].sort();
  const availableCounties = [...new Set(results.map(i => i.county).filter((c): c is string => !!c))].sort();

  return {
    institutions: paginatedResults,
    total: results.length,
    page,
    totalPages: Math.ceil(results.length / limit),
    filters: {
      availableStates,
      availableCities,
      availableDistricts,
      availableCounties
    }
  };
} 