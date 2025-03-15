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
          console.log('Initial session found:', session.user.email);
          setSession(session)
          setUser(session.user)
        } else {
          console.log('No initial session found');
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
        console.log('Auth state changed:', event);
        console.log('Session user:', session?.user?.email || 'No user');
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
      console.log('AuthContext: Signing up with Supabase', { email, userData })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        }
      })
      
      if (error) {
        console.error('AuthContext: Signup error', error)
        return { error, user: null }
      }
      
      console.log('AuthContext: Signup successful', data)
      
      // If auto-confirm is enabled, we can create the profile here
      if (data.user && data.user.confirmed_at) {
        try {
          // Ensure profile exists
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              full_name: userData.full_name,
              first_name: userData.first_name,
              last_name: userData.last_name,
              middle_name: userData.middle_name,
              status: userData.status,
              institution: userData.institution,
              institution_id: userData.institution_id,
              city: userData.city,
              state: userData.state,
              updated_at: new Date().toISOString()
            })
            
          if (profileError) {
            console.error('AuthContext: Error creating profile', profileError)
          }
        } catch (profileErr) {
          console.error('AuthContext: Profile creation error', profileErr)
        }
      }
      
      return { error: null, user: data.user }
    } catch (error) {
      console.error('AuthContext: Error signing up:', error)
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