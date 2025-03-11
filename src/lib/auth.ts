'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

// Client-side auth helpers
export { useSession, signIn, signOut }

// Type-safe session hook
export function useAuthSession() {
  const { data: session, status } = useSession()
  return { 
    session, 
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user
  }
}

// Custom login function with redirect
export async function login(
  credentials: { email: string; password: string },
  callbackUrl?: string
) {
  return signIn('credentials', {
    ...credentials,
    callbackUrl: callbackUrl || '/'
  })
}

// Sign out with redirect
export async function logout(callbackUrl?: string) {
  return signOut({
    callbackUrl: callbackUrl || '/'
  })
} 