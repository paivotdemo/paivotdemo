// Server-side authentication utilities
import { type Session } from 'next-auth'

export type { Session }

// Type declarations for session and auth
export interface AuthSession extends Session {
  user: {
    id: string
    role: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

// This file should NOT import from route.ts (which contains server components)
// Instead, we will define the common types and configurations 
// that both server and client need 