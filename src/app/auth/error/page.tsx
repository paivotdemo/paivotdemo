'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  useEffect(() => {
    const error = searchParams.get('error')
    
    if (error) {
      switch (error) {
        case 'CredentialsSignin':
          setErrorMessage('Invalid email or password. Please try again.')
          break
        case 'AccessDenied':
          setErrorMessage('You do not have permission to access this resource.')
          break
        case 'OAuthAccountNotLinked':
          setErrorMessage('This email is already associated with a different account.')
          break
        case 'OAuthSignin':
        case 'OAuthCallback':
          setErrorMessage('There was a problem with the social login. Please try again.')
          break
        default:
          setErrorMessage('An unexpected authentication error occurred. Please try again.')
      }
    }
  }, [searchParams])

  return (
    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
      {errorMessage || 'An error occurred during authentication.'}
    </div>
  )
}

export default function AuthError() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center pb-24">
      <div className="fixed inset-0 bg-black -z-10"></div>
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Authentication Error</h1>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <Suspense fallback={<div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">Loading error details...</div>}>
            <ErrorContent />
          </Suspense>
          
          <div className="flex flex-col space-y-4">
            <Link 
              href="/login" 
              className="w-full flex items-center justify-center px-8 py-3 rounded-lg bg-amber-400 hover:bg-amber-500 transition-colors text-white text-xl font-medium"
            >
              Back to Login
            </Link>
            
            <Link 
              href="/" 
              className="w-full flex items-center justify-center px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-xl font-medium border border-white/20"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
} 