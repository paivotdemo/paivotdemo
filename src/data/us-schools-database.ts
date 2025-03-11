interface USSchool {
  id: string;
  name: string;
  type: 'highschool' | 'college' | 'university';
  city: string;
  state: string;
  zip: string;
  isPublic: boolean;
  website?: string;
}

// Sample data structure - we can expand this with real data
const usSchools: USSchool[] = [
  {
    id: '1',
    name: 'Harvard University',
    type: 'university',
    city: 'Cambridge',
    state: 'MA',
    zip: '02138',
    isPublic: false,
    website: 'https://www.harvard.edu'
  },
  {
    id: '2',
    name: 'Stanford University',
    type: 'university',
    city: 'Stanford',
    state: 'CA',
    zip: '94305',
    isPublic: false,
    website: 'https://www.stanford.edu'
  }
];

export interface SchoolSearchParams {
  query?: string;
  state?: string;
  city?: string;
  type?: 'highschool' | 'college' | 'university';
  isPublic?: boolean;
}

export function searchSchools(params: SchoolSearchParams): USSchool[] {
  let results = [...usSchools];

  if (params.query) {
    const searchQuery = params.query.toLowerCase();
    results = results.filter(school => 
      school.name.toLowerCase().includes(searchQuery) ||
      school.city.toLowerCase().includes(searchQuery) ||
      school.state.toLowerCase().includes(searchQuery)
    );
  }

  if (params.state) {
    results = results.filter(school => 
      school.state.toLowerCase() === params.state?.toLowerCase()
    );
  }

  if (params.city) {
    results = results.filter(school => 
      school.city.toLowerCase() === params.city?.toLowerCase()
    );
  }

  if (params.type) {
    results = results.filter(school => school.type === params.type);
  }

  if (params.isPublic !== undefined) {
    results = results.filter(school => school.isPublic === params.isPublic);
  }

  return results;
}

export { usSchools };
export type { USSchool }; 