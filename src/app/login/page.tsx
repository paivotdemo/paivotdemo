'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const router = useRouter()
  const { signIn, signInWithOAuth, user } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/profile')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { error } = await signIn(loginData.email, loginData.password)
      
      if (error) {
        setError(error.message || 'Invalid credentials')
      } else {
        router.push('/profile')
      }
    } catch (error: any) {
      setError('An error occurred during sign in')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'linkedin') => {
    try {
      await signInWithOAuth(provider)
    } catch (error: any) {
      setError('An error occurred during social sign in')
      console.error(error)
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center pb-24">
      <div className="fixed inset-0 bg-black -z-10"></div>
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Welcome Back</h1>
          <p className="text-xl text-white/60">Don't have an account yet?</p>
          <Link 
            href="/signup" 
            className="inline-block mt-4 px-8 py-3 text-xl font-medium text-white bg-amber-400/50 hover:bg-amber-500/50 rounded-full backdrop-blur-sm transition-all duration-300 border border-white/30"
          >
            Sign Up
          </Link>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          )}
          
          <div className="space-y-4 mb-8">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-white hover:bg-gray-100 transition-colors text-gray-800 text-xl font-medium"
            >
              <img src="/google.svg" alt="Google" className="w-6 h-6" />
              Continue with Google
            </button>
            
            <button
              onClick={() => handleSocialLogin('apple')}
              className="w-full flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-black hover:bg-gray-900 transition-colors text-white text-xl font-medium border border-white/20"
            >
              <img src="/apple.svg" alt="Apple" className="w-6 h-6" />
              Continue with Apple
            </button>
            
            <button
              onClick={() => handleSocialLogin('linkedin')}
              className="w-full flex items-center justify-center gap-3 px-8 py-3 rounded-lg bg-[#0077B5] hover:bg-[#006399] transition-colors text-white text-xl font-medium"
            >
              <img src="/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
              Continue with LinkedIn
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-white/60 backdrop-blur-sm">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white/80 mb-2 text-lg">Email</label>
              <input
                type="email"
                id="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white/80 mb-2 text-lg">Password</label>
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white placeholder-white/50"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-400 text-white px-8 py-3 rounded-lg hover:bg-amber-500 transition-colors text-xl font-medium"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
} 