'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

// Define the auth context type
type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null, user: User | null }>
  signOut: () => Promise<void>
  signInWithOAuth: (provider: 'google' | 'apple' | 'linkedin') => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  signInWithOAuth: async () => {},
})

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          setSession(session)
          setUser(session.user)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }
    
    getInitialSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { error }
    }
  }
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        }
      })
      
      if (error) {
        return { error, user: null }
      }
      
      return { error: null, user: data.user }
    } catch (error) {
      console.error('Error signing up:', error)
      return { error, user: null }
    }
  }
  
  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  
  // Sign in with OAuth provider
  const signInWithOAuth = async (provider: 'google' | 'apple' | 'linkedin') => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      })
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
    }
  }
  
  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
      signInWithOAuth,
    }}>
      {children}
    </AuthContext.Provider>
  )
} 