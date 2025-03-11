interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

interface Institution {
  id: string
  name: string
  city: string
  state: string
  type: 'highschool' | 'college'
}

// Mock institutions data
const institutions: Institution[] = [
  {
    id: '1',
    name: 'Lincoln High School',
    city: 'Portland',
    state: 'Oregon',
    type: 'highschool'
  },
  {
    id: '2',
    name: 'Roosevelt High School',
    city: 'Seattle',
    state: 'Washington',
    type: 'highschool'
  },
  {
    id: '3',
    name: 'Berkeley High School',
    city: 'Berkeley',
    state: 'California',
    type: 'highschool'
  },
  {
    id: '4',
    name: 'Garfield High School',
    city: 'Seattle',
    state: 'Washington',
    type: 'highschool'
  },
  {
    id: '5',
    name: 'Oakland Technical High School',
    city: 'Oakland',
    state: 'California',
    type: 'highschool'
  },
  {
    id: '6',
    name: 'Ballard High School',
    city: 'Seattle',
    state: 'Washington',
    type: 'highschool'
  },
  {
    id: '7',
    name: 'Grant High School',
    city: 'Portland',
    state: 'Oregon',
    type: 'highschool'
  },
  {
    id: '8',
    name: 'Skyline High School',
    city: 'Oakland',
    state: 'California',
    type: 'highschool'
  }
]

export const searchInstitutions = (query: string, type: 'highschool' | 'college' = 'highschool') => {
  const searchTerm = query.toLowerCase().trim()
  
  return institutions.filter(institution => 
    institution.type === type && (
      institution.name.toLowerCase().includes(searchTerm) ||
      institution.city.toLowerCase().includes(searchTerm) ||
      institution.state.toLowerCase().includes(searchTerm)
    )
  )
}

// Mock users data
const users: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'john@paivot.com',
    name: 'John Admin',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    email: 'alice@gmail.com',
    name: 'Alice Smith',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    email: 'bob@outlook.com',
    name: 'Bob Johnson',
    createdAt: new Date().toISOString()
  }
]

export const getUsers = () => users

export const deleteUser = (userId: string) => {
  const index = users.findIndex(user => user.id === userId)
  if (index !== -1) {
    users.splice(index, 1)
    return true
  }
  return false
} 