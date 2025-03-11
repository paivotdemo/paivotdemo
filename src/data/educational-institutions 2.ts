export interface Institution {
  name: string;
  city: string;
  state: string;
  type: 'highschool' | 'college';
  // Additional fields from NCES
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
  grades?: string;
  isPublic?: boolean;
  // Additional fields for better filtering
  tuition?: number;
  acceptanceRate?: number;
  graduationRate?: number;
  studentBodySize?: 'small' | 'medium' | 'large';
  religiousAffiliation?: string;
  setting?: 'urban' | 'suburban' | 'rural';
}

interface SearchParams {
  query?: string;
  state?: string;
  city?: string;
  type?: 'highschool' | 'college';
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'city' | 'state';
  sortOrder?: 'asc' | 'desc';
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

// Function to search all institutions with filters
export async function searchInstitutions(params: SearchParams): Promise<SearchResponse> {
  const institutions = params.type === 'highschool' ? highSchools : colleges;
  
  // Filter institutions based on search query
  const filteredInstitutions = institutions.filter(institution => {
    if (!params.query) return true;
    const query = params.query.toLowerCase();
    return (
      institution.name.toLowerCase().includes(query) ||
      institution.city.toLowerCase().includes(query) ||
      institution.state.toLowerCase().includes(query)
    );
  });

  // Get available filters
  const availableStates = [...new Set(filteredInstitutions.map(i => i.state))].sort();
  const availableCities = [...new Set(filteredInstitutions.map(i => i.city))].sort();
  const availableDistricts = [...new Set(filteredInstitutions.map(i => i.district).filter((d: string | undefined): d is string => !!d))].sort();
  const availableCounties = [...new Set(filteredInstitutions.map(i => i.county).filter((c: string | undefined): c is string => !!c))].sort();

  return {
    institutions: filteredInstitutions,
    total: filteredInstitutions.length,
    page: params.page || 1,
    totalPages: Math.ceil(filteredInstitutions.length / (params.limit || 20)),
    filters: {
      availableStates,
      availableCities,
      availableDistricts,
      availableCounties
    }
  };
}

export const highSchools: Institution[] = [
  { name: "Abraham Lincoln High School", city: "San Francisco", state: "CA", type: "highschool" },
  { name: "Academy of Science and Technology", city: "Houston", state: "TX", type: "highschool" },
  { name: "Adlai E. Stevenson High School", city: "Lincolnshire", state: "IL", type: "highschool" },
  { name: "Alexander Hamilton High School", city: "Los Angeles", state: "CA", type: "highschool" },
  { name: "Benjamin Franklin High School", city: "New Orleans", state: "LA", type: "highschool" },
  { name: "Central High School", city: "Philadelphia", state: "PA", type: "highschool" },
  { name: "East High School", city: "Denver", state: "CO", type: "highschool" },
  { name: "George Washington High School", city: "New York", state: "NY", type: "highschool" },
  { name: "Highland High School", city: "Salt Lake City", state: "UT", type: "highschool" },
  { name: "Jefferson High School", city: "Portland", state: "OR", type: "highschool" },
  { name: "Kennedy High School", city: "Richmond", state: "CA", type: "highschool" },
  { name: "Lincoln High School", city: "Seattle", state: "WA", type: "highschool" },
  { name: "Madison High School", city: "Madison", state: "WI", type: "highschool" },
  { name: "North High School", city: "Minneapolis", state: "MN", type: "highschool" },
  { name: "Oakland High School", city: "Oakland", state: "CA", type: "highschool" },
  { name: "Park High School", city: "Livingston", state: "MT", type: "highschool" },
  { name: "Riverside High School", city: "Riverside", state: "CA", type: "highschool" },
  { name: "South High School", city: "Minneapolis", state: "MN", type: "highschool" },
  { name: "Thomas Jefferson High School", city: "Alexandria", state: "VA", type: "highschool" },
  { name: "Washington High School", city: "Washington", state: "DC", type: "highschool" },
  { name: "West High School", city: "Salt Lake City", state: "UT", type: "highschool" },
  // Add more high schools here...
];

export const colleges: Institution[] = [
  // Ivy League
  { name: "Harvard University", city: "Cambridge", state: "MA", type: "college" },
  { name: "Yale University", city: "New Haven", state: "CT", type: "college" },
  { name: "Princeton University", city: "Princeton", state: "NJ", type: "college" },
  { name: "Columbia University", city: "New York", state: "NY", type: "college" },
  { name: "University of Pennsylvania", city: "Philadelphia", state: "PA", type: "college" },
  { name: "Brown University", city: "Providence", state: "RI", type: "college" },
  { name: "Dartmouth College", city: "Hanover", state: "NH", type: "college" },
  { name: "Cornell University", city: "Ithaca", state: "NY", type: "college" },

  // Top Public Universities
  { name: "University of California, Berkeley", city: "Berkeley", state: "CA", type: "college" },
  { name: "University of California, Los Angeles", city: "Los Angeles", state: "CA", type: "college" },
  { name: "University of Michigan", city: "Ann Arbor", state: "MI", type: "college" },
  { name: "University of Virginia", city: "Charlottesville", state: "VA", type: "college" },
  { name: "University of North Carolina at Chapel Hill", city: "Chapel Hill", state: "NC", type: "college" },
  { name: "University of Wisconsin-Madison", city: "Madison", state: "WI", type: "college" },
  { name: "University of Illinois at Urbana-Champaign", city: "Champaign", state: "IL", type: "college" },
  { name: "University of Texas at Austin", city: "Austin", state: "TX", type: "college" },
  { name: "University of Washington", city: "Seattle", state: "WA", type: "college" },
  { name: "University of Florida", city: "Gainesville", state: "FL", type: "college" },

  // Top Private Universities
  { name: "Stanford University", city: "Stanford", state: "CA", type: "college" },
  { name: "Massachusetts Institute of Technology", city: "Cambridge", state: "MA", type: "college" },
  { name: "California Institute of Technology", city: "Pasadena", state: "CA", type: "college" },
  { name: "University of Chicago", city: "Chicago", state: "IL", type: "college" },
  { name: "Northwestern University", city: "Evanston", state: "IL", type: "college" },
  { name: "Duke University", city: "Durham", state: "NC", type: "college" },
  { name: "Johns Hopkins University", city: "Baltimore", state: "MD", type: "college" },
  { name: "Rice University", city: "Houston", state: "TX", type: "college" },
  { name: "University of Notre Dame", city: "Notre Dame", state: "IN", type: "college" },
  { name: "Vanderbilt University", city: "Nashville", state: "TN", type: "college" },

  // Liberal Arts Colleges
  { name: "Williams College", city: "Williamstown", state: "MA", type: "college" },
  { name: "Amherst College", city: "Amherst", state: "MA", type: "college" },
  { name: "Swarthmore College", city: "Swarthmore", state: "PA", type: "college" },
  { name: "Pomona College", city: "Claremont", state: "CA", type: "college" },
  { name: "Wellesley College", city: "Wellesley", state: "MA", type: "college" },
  { name: "Bowdoin College", city: "Brunswick", state: "ME", type: "college" },
  { name: "Carleton College", city: "Northfield", state: "MN", type: "college" },
  { name: "Middlebury College", city: "Middlebury", state: "VT", type: "college" },
  { name: "Claremont McKenna College", city: "Claremont", state: "CA", type: "college" },
  { name: "Davidson College", city: "Davidson", state: "NC", type: "college" },

  // Historically Black Colleges and Universities (HBCUs)
  { name: "Howard University", city: "Washington", state: "DC", type: "college" },
  { name: "Spelman College", city: "Atlanta", state: "GA", type: "college" },
  { name: "Morehouse College", city: "Atlanta", state: "GA", type: "college" },
  { name: "Hampton University", city: "Hampton", state: "VA", type: "college" },
  { name: "Tuskegee University", city: "Tuskegee", state: "AL", type: "college" },

  // State Universities
  { name: "University of California, San Diego", city: "La Jolla", state: "CA", type: "college" },
  { name: "University of California, Davis", city: "Davis", state: "CA", type: "college" },
  { name: "University of California, Irvine", city: "Irvine", state: "CA", type: "college" },
  { name: "University of California, Santa Barbara", city: "Santa Barbara", state: "CA", type: "college" },
  { name: "University of California, Riverside", city: "Riverside", state: "CA", type: "college" },
  { name: "University of California, Santa Cruz", city: "Santa Cruz", state: "CA", type: "college" },
  { name: "University of California, Merced", city: "Merced", state: "CA", type: "college" },
  { name: "University of Minnesota", city: "Minneapolis", state: "MN", type: "college" },
  { name: "University of Arizona", city: "Tucson", state: "AZ", type: "college" },
  { name: "University of Colorado Boulder", city: "Boulder", state: "CO", type: "college" },
  { name: "University of Oregon", city: "Eugene", state: "OR", type: "college" },
  { name: "University of Utah", city: "Salt Lake City", state: "UT", type: "college" },
  { name: "University of Kansas", city: "Lawrence", state: "KS", type: "college" },
  { name: "University of Nebraska-Lincoln", city: "Lincoln", state: "NE", type: "college" },
  { name: "University of Iowa", city: "Iowa City", state: "IA", type: "college" },
  { name: "University of Missouri", city: "Columbia", state: "MO", type: "college" },
  { name: "University of Arkansas", city: "Fayetteville", state: "AR", type: "college" },
  { name: "University of Oklahoma", city: "Norman", state: "OK", type: "college" },
  { name: "University of Kentucky", city: "Lexington", state: "KY", type: "college" },
  { name: "University of Tennessee", city: "Knoxville", state: "TN", type: "college" },
  { name: "University of Alabama", city: "Tuscaloosa", state: "AL", type: "college" },
  { name: "University of Georgia", city: "Athens", state: "GA", type: "college" },
  { name: "University of South Carolina", city: "Columbia", state: "SC", type: "college" },
  { name: "University of Mississippi", city: "Oxford", state: "MS", type: "college" },
  { name: "Louisiana State University", city: "Baton Rouge", state: "LA", type: "college" },
  { name: "University of Hawaii at Manoa", city: "Honolulu", state: "HI", type: "college" },
  { name: "University of Alaska Fairbanks", city: "Fairbanks", state: "AK", type: "college" },

  // Additional Private Universities
  { name: "Georgetown University", city: "Washington", state: "DC", type: "college" },
  { name: "Carnegie Mellon University", city: "Pittsburgh", state: "PA", type: "college" },
  { name: "Emory University", city: "Atlanta", state: "GA", type: "college" },
  { name: "New York University", city: "New York", state: "NY", type: "college" },
  { name: "University of Southern California", city: "Los Angeles", state: "CA", type: "college" },
  { name: "Boston University", city: "Boston", state: "MA", type: "college" },
  { name: "Tufts University", city: "Medford", state: "MA", type: "college" },
  { name: "Wake Forest University", city: "Winston-Salem", state: "NC", type: "college" },
  { name: "Case Western Reserve University", city: "Cleveland", state: "OH", type: "college" },
  { name: "Brandeis University", city: "Waltham", state: "MA", type: "college" },
  { name: "Lehigh University", city: "Bethlehem", state: "PA", type: "college" },
  { name: "Villanova University", city: "Villanova", state: "PA", type: "college" },
  { name: "Pepperdine University", city: "Malibu", state: "CA", type: "college" },
  { name: "Santa Clara University", city: "Santa Clara", state: "CA", type: "college" },
  { name: "Loyola Marymount University", city: "Los Angeles", state: "CA", type: "college" },
  { name: "Baylor University", city: "Waco", state: "TX", type: "college" },
  { name: "Southern Methodist University", city: "Dallas", state: "TX", type: "college" },
  { name: "Tulane University", city: "New Orleans", state: "LA", type: "college" },
  { name: "University of Miami", city: "Coral Gables", state: "FL", type: "college" },
  { name: "George Washington University", city: "Washington", state: "DC", type: "college" },
  { name: "American University", city: "Washington", state: "DC", type: "college" },
  { name: "Syracuse University", city: "Syracuse", state: "NY", type: "college" },
  { name: "Rensselaer Polytechnic Institute", city: "Troy", state: "NY", type: "college" },
  { name: "Worcester Polytechnic Institute", city: "Worcester", state: "MA", type: "college" },
  { name: "Stevens Institute of Technology", city: "Hoboken", state: "NJ", type: "college" },
  { name: "Colorado School of Mines", city: "Golden", state: "CO", type: "college" },
  { name: "Rose-Hulman Institute of Technology", city: "Terre Haute", state: "IN", type: "college" },
  { name: "Cooper Union", city: "New York", state: "NY", type: "college" },
  { name: "Olin College of Engineering", city: "Needham", state: "MA", type: "college" },
  { name: "Harvey Mudd College", city: "Claremont", state: "CA", type: "college" },
  { name: "Webb Institute", city: "Glen Cove", state: "NY", type: "college" }
];

// Fallback data
export const allInstitutions = [...highSchools, ...colleges]; 