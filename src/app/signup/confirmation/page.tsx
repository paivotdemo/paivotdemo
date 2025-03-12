'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupConfirmation() {
  const router = useRouter()
  const { user } = useAuth()
  const [email, setEmail] = useState('')

  // If user is already confirmed, redirect to profile
  useEffect(() => {
    if (user?.confirmed_at) {
      router.push('/profile')
    } else if (user?.email) {
      setEmail(user.email)
    }
  }, [user, router])

  return (
    <main className="min-h-screen bg-black flex items-center justify-center pb-24">
      <div className="fixed inset-0 bg-black -z-10"></div>
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Check Your Email</h1>
          <p className="text-xl text-white/60">
            We've sent a confirmation link to:
          </p>
          <p className="text-xl text-amber-400 mt-2 mb-4">
            {email || 'your email address'}
          </p>
          <p className="text-white/60 mb-8">
            Please click the link in the email to confirm your account.
            The email might take a few minutes to arrive.
          </p>
          <Link 
            href="/login" 
            className="inline-block mt-4 px-8 py-3 text-xl font-medium text-white bg-amber-400/50 hover:bg-amber-500/50 rounded-full backdrop-blur-sm transition-all duration-300 border border-white/30"
          >
            Back to Login
          </Link>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Didn't receive the email?</h2>
          <ul className="text-white/60 space-y-2 list-disc pl-5">
            <li>Check your spam or junk folder</li>
            <li>Make sure you entered the correct email address</li>
            <li>Allow a few minutes for the email to arrive</li>
          </ul>
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/signup')}
              className="text-amber-400 hover:text-amber-300 transition-colors"
            >
              Try signing up again
            </button>
          </div>
        </div>
      </div>
    </main>
  )
} 