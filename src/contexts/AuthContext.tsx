'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoIdToken,
  ISignUpResult,
  CognitoUserSession
} from 'amazon-cognito-identity-js'

// Configure Cognito User Pool
const userPool = new CognitoUserPool({
  UserPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
  ClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
})

// Define the auth context type
type AuthContextType = {
  user: CognitoUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: Error | null, user: CognitoUser | null }>
  signOut: () => void
  signInWithOAuth: (provider: 'google' | 'apple' | 'linkedin') => Promise<void>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: () => {},
  signInWithOAuth: async () => {},
})

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<CognitoUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if there's a current authenticated user
    const getCurrentUser = async () => {
      try {
        const currentUser = userPool.getCurrentUser()
        if (currentUser) {
          currentUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
              console.error('Error getting session:', err)
              setLoading(false)
              return
            }
            if (session?.isValid()) {
              setUser(currentUser)
            }
          })
        }
      } catch (error) {
        console.error('Error getting current user:', error)
      } finally {
        setLoading(false)
      }
    }

    getCurrentUser()
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    return new Promise<{ error: Error | null }>((resolve) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      })

      const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool
      })

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session: CognitoUserSession) => {
          setUser(cognitoUser)
          resolve({ error: null })
        },
        onFailure: (err: Error) => {
          console.error('Error signing in:', err)
          resolve({ error: err })
        }
      })
    })
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: any) => {
    return new Promise<{ error: Error | null, user: CognitoUser | null }>((resolve) => {
      const attributeList = [
        new CognitoUserAttribute({ Name: 'email', Value: email }),
        new CognitoUserAttribute({ Name: 'name', Value: userData.full_name || '' }),
        new CognitoUserAttribute({ Name: 'custom:first_name', Value: userData.first_name || '' }),
        new CognitoUserAttribute({ Name: 'custom:last_name', Value: userData.last_name || '' }),
      ]

      userPool.signUp(email, password, attributeList, [], (err: Error | undefined, result?: ISignUpResult) => {
        if (err) {
          console.error('Error signing up:', err)
          resolve({ error: err, user: null })
          return
        }
        if (result) {
          resolve({ error: null, user: result.user })
        }
      })
    })
  }

  // Sign out
  const signOut = () => {
    const currentUser = userPool.getCurrentUser()
    if (currentUser) {
      currentUser.signOut()
      setUser(null)
      router.push('/')
    }
  }

  // Sign in with OAuth provider
  const signInWithOAuth = async (provider: 'google' | 'apple' | 'linkedin') => {
    // Cognito hosted UI URL
    const domain = `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}.auth.${process.env.NEXT_PUBLIC_AWS_REGION}.amazoncognito.com`
    const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/profile` : ''
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
    
    const url = `https://${domain}/oauth2/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `scope=email+openid+profile&` +
      `redirect_uri=${redirectUri}&` +
      `identity_provider=${provider}`

    if (typeof window !== 'undefined') {
      window.location.href = url
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
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