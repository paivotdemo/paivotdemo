'use client'

import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { USSchool } from '../../data/us-schools-database'

export default function SignUp() {
  const router = useRouter()
  const { signUp, user } = useAuth()
  const [step, setStep] = useState(1)
  const [showInstitutionDropdown, setShowInstitutionDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<USSchool[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    middleName: '',
    lastName: '',
    status: '' as 'highschool' | 'university' | 'employed',
    institution: '',
    institutionId: '',
    city: '',
    state: ''
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/profile')
    }
  }, [user, router])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('') // Clear any existing errors
    
    if (step === 1) {
      if (signupData.password !== signupData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!signupData.firstName || !signupData.lastName) {
        setError('First and last name are required')
        return
      }
      setStep(3)
    } else {
      if (!signupData.status) {
        setError('Please select your current status')
        return
      }
      if ((signupData.status === 'highschool' || signupData.status === 'university') && !signupData.institution) {
        setError('Please select your institution')
        return
      }
      // Handle final submission
      try {
        setLoading(true)
        
        // Prepare user data for Supabase
        const userData = {
          first_name: signupData.firstName,
          middle_name: signupData.middleName,
          last_name: signupData.lastName,
          full_name: `${signupData.firstName} ${signupData.lastName}`,
          status: signupData.status,
          institution: signupData.institution,
          institution_id: signupData.institutionId,
          city: signupData.city,
          state: signupData.state
        }
        
        // Register with Supabase
        const { error, user } = await signUp(signupData.email, signupData.password, userData)
        
        if (error) {
          throw new Error(error.message || 'Registration failed')
        }
        
        // If email confirmation is required
        if (!user?.confirmed_at) {
          router.push('/signup/confirmation')
        } else {
          router.push('/profile')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to create account')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  // Update form data and clear errors
  const updateFormData = (updates: Partial<typeof signupData>) => {
    setSignupData((prev: typeof signupData) => ({ ...prev, ...updates }))
    setError('') // Clear errors when user makes changes
  }

  const handleInstitutionSearch = async (query: string) => {
    setSearchQuery(query)
    updateFormData({ institution: query })
    
    if (query.length >= 2) {
      try {
        setLoading(true)
        const response = await fetch(`/api/institutions/search?q=${encodeURIComponent(query)}&type=${signupData.status}`)
        const data = await response.json()
        setSearchResults(data.institutions || [])
        setShowInstitutionDropdown(true)
      } catch (err) {
        console.error('Failed to search institutions:', err)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    } else {
      setSearchResults([])
      setShowInstitutionDropdown(false)
    }
  }

  const handleInstitutionSelect = (institution: USSchool) => {
    updateFormData({
      institution: institution.name,
      institutionId: institution.id,
      city: institution.city,
      state: institution.state
    })
    setSearchQuery(institution.name)
    setShowInstitutionDropdown(false)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white/80 mb-2 text-lg">Email</label>
              <input
                type="email"
                id="email"
                value={signupData.email}
                onChange={(e) => updateFormData({ email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white/80 mb-2 text-lg">Password</label>
              <input
                type="password"
                id="password"
                value={signupData.password}
                onChange={(e) => updateFormData({ password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white/80 mb-2 text-lg">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={signupData.confirmPassword}
                onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white placeholder-white/50"
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block text-white/80 mb-2 text-lg">First Name</label>
              <input
                type="text"
                id="firstName"
                value={signupData.firstName}
                onChange={(e) => updateFormData({ firstName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white placeholder-white/50"
                required
              />
            </div>

            <div>
              <label htmlFor="middleName" className="block text-white/80 mb-2 text-lg">Middle Name (Optional)</label>
              <input
                type="text"
                id="middleName"
                value={signupData.middleName}
                onChange={(e) => updateFormData({ middleName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white placeholder-white/50"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-white/80 mb-2 text-lg">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={signupData.lastName}
                onChange={(e) => updateFormData({ lastName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white placeholder-white/50"
                required
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="status" className="block text-white/80 mb-2 text-lg">Current Status</label>
              <select
                id="status"
                value={signupData.status}
                onChange={(e) => {
                  updateFormData({ 
                    status: e.target.value as 'highschool' | 'university' | 'employed',
                    institution: '',
                    institutionId: '',
                    city: '',
                    state: ''
                  })
                  setSearchQuery('')
                  setSearchResults([])
                }}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white placeholder-white/50"
                required
              >
                <option value="">Select your status</option>
                <option value="highschool">High School Student</option>
                <option value="university">University Student</option>
                <option value="employed">Employed</option>
              </select>
            </div>

            {(signupData.status === 'highschool' || signupData.status === 'university') && (
              <div className="relative">
                <label htmlFor="institution" className="block text-white/80 mb-2 text-lg">
                  {signupData.status === 'highschool' ? 'High School Name' : 'University Name'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="institution"
                    value={searchQuery}
                    onChange={(e) => handleInstitutionSearch(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.length >= 2) {
                        setShowInstitutionDropdown(true)
                      }
                    }}
                    placeholder={`Search by name, city, or state`}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-white placeholder-white/50"
                    required
                  />
                  {loading && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400"></div>
                    </div>
                  )}
                </div>

                {showInstitutionDropdown && searchResults.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 max-h-60 overflow-auto shadow-xl">
                    {searchResults.map((institution) => (
                      <div
                        key={institution.id}
                        onClick={() => handleInstitutionSelect(institution)}
                        className="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-white">{institution.name}</div>
                        <div className="text-sm text-white/60">
                          {institution.city}, {institution.state}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center pb-24">
      <div className="fixed inset-0 bg-black -z-10"></div>
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">Create Account</h1>
          <p className="text-xl text-white/60">Already have an account?</p>
          <Link 
            href="/login" 
            className="inline-block mt-4 px-8 py-3 text-xl font-medium text-white bg-amber-400/50 hover:bg-amber-500/50 rounded-full backdrop-blur-sm transition-all duration-300 border border-white/30"
          >
            Sign In
          </Link>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full ${
                    s === step ? 'bg-amber-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <div className="text-white/60 text-sm">
              Step {step} of 3
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}
            
            <div className="flex justify-between items-center pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setStep(step - 1)
                    setError('')
                  }}
                  className="px-6 py-2 text-white/80 hover:text-white transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className={`px-8 py-3 rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xl font-medium transition-colors ${
                  step === 1 ? 'w-full' : 'ml-auto'
                }`}
              >
                {step === 3 ? 'Create Account' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 