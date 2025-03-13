'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Profile() {
  const router = useRouter()
  const { user, signOut, loading } = useAuth()
  const [profileImage, setProfileImage] = useState('/default-avatar.png')
  const [bannerImage, setBannerImage] = useState('/default-banner.jpg')
  const [userAttributes, setUserAttributes] = useState<{ [key: string]: string }>({})

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      // Get user attributes
      user.getUserAttributes((err, attributes) => {
        if (err) {
          console.error('Error getting user attributes:', err)
          return
        }
        
        const attrs: { [key: string]: string } = {}
        attributes?.forEach(attr => {
          attrs[attr.Name] = attr.Value
        })
        setUserAttributes(attrs)
      })
    }
  }, [user, loading, router])

  // If still loading or no user, show loading state
  if (loading || !user) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </main>
    )
  }

  const projects = [
    { id: 1, name: "Career Path Analysis", progress: 75, status: "In Progress" },
    { id: 2, name: "Skills Assessment", progress: 100, status: "Completed" },
    { id: 3, name: "Interview Preparation", progress: 30, status: "In Progress" },
  ]

  const stats = [
    { label: "Completed Projects", value: "12" },
    { label: "Skills Acquired", value: "24" },
    { label: "Hours Invested", value: "156" },
    { label: "Achievements", value: "8" },
  ]

  // Get user data from attributes
  const fullName = userAttributes['name'] || 
    `${userAttributes['custom:first_name'] || ''} ${userAttributes['custom:last_name'] || ''}`.trim() || 
    'User'
  const userRole = userAttributes['custom:role'] || 'user'

  return (
    <main className="min-h-screen bg-black">
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-amber-400/20 to-amber-600/20">
          <Image
            src={bannerImage}
            alt="Profile Banner"
            fill
            className="object-cover opacity-50"
          />
        </div>
        
        <div className="absolute -bottom-16 left-8">
          <div className="relative w-32 h-32 rounded-full border-4 border-black overflow-hidden">
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="pt-20 px-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">{fullName}</h1>
            <p className="text-amber-400 mt-1">{userRole}</p>
          </div>
          <button
            onClick={signOut}
            className="px-6 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-500 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Your Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">{project.name}</h3>
                  <span className="text-amber-400">{project.status}</span>
                </div>
                <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 